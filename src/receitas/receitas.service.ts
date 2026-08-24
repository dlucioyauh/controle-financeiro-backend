import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceitaEntity } from './receita.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReceitasService {
  constructor(
    @InjectRepository(ReceitaEntity)
    private receitaRepository: Repository<ReceitaEntity>,
    private usersService: UsersService,
  ) {}

  async criar(data: Partial<ReceitaEntity> & { userId: string }): Promise<ReceitaEntity> {
    // 1. Verificar limite para usuários do plano Free
    const user = await this.usersService.findById(data.userId);
    const userPlan = user?.plano?.toLowerCase() || 'free';

    if (userPlan === 'free') {
      const count = await this.receitaRepository.count({ where: { userId: data.userId } });
      if (count >= 5) {
        throw new ForbiddenException('Limite de 5 produtos/receitas atingido no plano Free. Faça upgrade para adicionar mais.');
      }
    }

    const receita = this.receitaRepository.create(data);
    return this.receitaRepository.save(receita);
  }

  // ✅ CORREÇÃO LGPD: Usar userId em vez de username
  async listar(userId: string): Promise<ReceitaEntity[]> {
    return this.receitaRepository.find({
      where: { userId },
      order: { nome: 'ASC' },
    });
  }

  async buscarPorId(id: string): Promise<ReceitaEntity> {
    const receita = await this.receitaRepository.findOne({ where: { id } });
    if (!receita) {
      throw new NotFoundException(`Receita com ID ${id} não encontrada`);
    }
    return receita;
  }

  async atualizar(id: string, data: Partial<ReceitaEntity>): Promise<ReceitaEntity> {
    const receita = await this.buscarPorId(id);
    Object.assign(receita, data);
    return this.receitaRepository.save(receita);
  }

  async remover(id: string): Promise<void> {
    const resultado = await this.receitaRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Receita com ID ${id} não encontrada`);
    }
  }
}
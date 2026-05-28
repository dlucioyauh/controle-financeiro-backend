import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceitaEntity } from './receita.entity';

@Injectable()
export class ReceitasService {
  constructor(
    @InjectRepository(ReceitaEntity)
    private receitaRepository: Repository<ReceitaEntity>,
  ) {}

  async criar(data: Partial<ReceitaEntity>): Promise<ReceitaEntity> {
    const receita = this.receitaRepository.create(data);
    return this.receitaRepository.save(receita);
  }

  async listarPorUsuario(usuario: string): Promise<ReceitaEntity[]> {
    return this.receitaRepository.find({
      where: { usuario },
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
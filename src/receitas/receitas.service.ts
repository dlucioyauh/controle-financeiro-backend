import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceitaEntity } from './receita.entity.js';

@Injectable()
export class ReceitasService {
  constructor(
    @InjectRepository(ReceitaEntity)
    private repo: Repository<ReceitaEntity>,
  ) {}

  async criar(dadosReceita: Partial<ReceitaEntity>, username: string): Promise<ReceitaEntity> {
    // Vincula a receita ao usuário logado
    const novaReceita = this.repo.create({ ...dadosReceita, usuario: username });
    return this.repo.save(novaReceita);
  }

  async listarTodas(username: string): Promise<ReceitaEntity[]> {
    // Busca apenas as receitas criadas pelo usuário logado
    return this.repo.find({
      where: { usuario: username },
      order: { createdAt: 'DESC' },
    });
  }

  async remover(id: string, username: string) {
    const receita = await this.repo.findOneBy({ id });
    
    if (receita && receita.usuario !== username) {
      throw new UnauthorizedException('Você não tem permissão para remover esta receita.');
    }
    
    return this.repo.delete(id);
  }
}
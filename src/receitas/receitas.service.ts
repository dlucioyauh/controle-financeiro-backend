import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReceitaEntity } from './receita.entity';

@Injectable()
export class ReceitasService {
  constructor(
    @InjectRepository(ReceitaEntity)
    private repo: Repository<ReceitaEntity>,
  ) {}

  findAll() {
    return this.repo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async create(data: Partial<ReceitaEntity>) {
    const receita = this.repo.create(data);

    return this.repo.save(receita);
  }

  async update(id: string, data: Partial<ReceitaEntity>) {
    const receitaExistente = await this.findOne(id);

    if (!receitaExistente) {
      throw new Error('Receita não encontrada');
    }

    Object.assign(receitaExistente, data);

    return this.repo.save(receitaExistente);
  }

  async remove(id: string) {
    const receita = await this.findOne(id);

    if (!receita) {
      throw new Error('Receita não encontrada');
    }

    return this.repo.remove(receita);
  }
}
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
      relations: ['ingredientes', 'ingredientes.ingrediente'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['ingredientes', 'ingredientes.ingrediente'],
    });
  }

  create(data: Partial<ReceitaEntity>) {
    return this.repo.save(data);
  }

  async update(id: string, data: Partial<ReceitaEntity>) {
    await this.repo.update(id, data);

    return this.findOne(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
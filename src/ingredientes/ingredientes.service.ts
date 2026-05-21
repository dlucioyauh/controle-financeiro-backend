import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IngredienteEntity } from './ingrediente.entity';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(IngredienteEntity)
    private repo: Repository<IngredienteEntity>,
  ) {}

  findAll() {
    return this.repo.find({
      order: {
        nome: 'ASC',
      },
    });
  }

  create(data: Partial<IngredienteEntity>) {
    return this.repo.save(data);
  }

  async update(id: string, data: Partial<IngredienteEntity>) {
    await this.repo.update(id, data);

    return this.repo.findOneBy({
      id,
    });
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
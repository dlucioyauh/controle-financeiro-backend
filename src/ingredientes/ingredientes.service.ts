import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingrediente } from './ingrediente.entity';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingrediente)
    private repo: Repository<Ingrediente>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<Ingrediente>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<Ingrediente>) {
    return this.repo.update(id, data).then(() => this.repo.findOneBy({ id }));
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
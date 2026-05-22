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

  findAll(usuario: string) {
    return this.repo.find({
      where: { usuario },
      order: { nome: 'ASC' },
    });
  }

  create(data: Partial<IngredienteEntity>, usuario: string) {
    return this.repo.save({ ...data, usuario });
  }

  async update(id: string, data: Partial<IngredienteEntity>, usuario: string) {
    await this.repo.update({ id, usuario }, data);
    return this.repo.findOneBy({ id, usuario });
  }

  remove(id: string, usuario: string) {
    return this.repo.delete({ id, usuario });
  }
}
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

  findAll(usuario: string) {
    return this.repo.find({
      where: { usuario },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string, usuario: string) {
    return this.repo.findOne({ where: { id, usuario } });
  }

  create(data: Partial<ReceitaEntity>, usuario: string) {
    return this.repo.save({ ...data, usuario });
  }

  async update(id: string, data: Partial<ReceitaEntity>, usuario: string) {
    const receita = await this.findOne(id, usuario);
    if (!receita) throw new Error('Receita não encontrada');
    Object.assign(receita, data);
    return this.repo.save(receita);
  }

  async remove(id: string, usuario: string) {
    const receita = await this.findOne(id, usuario);
    if (!receita) throw new Error('Receita não encontrada');
    return this.repo.remove(receita);
  }
}
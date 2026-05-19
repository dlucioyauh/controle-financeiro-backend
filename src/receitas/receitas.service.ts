import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receita } from './receita.entity';

@Injectable()
export class ReceitasService {
  constructor(
    @InjectRepository(Receita)
    private repo: Repository<Receita>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Receita>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<Receita>) {
    return this.repo.update(id, data).then(() => this.repo.findOneBy({ id }));
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Despesa } from './despesa.entity';

@Injectable()
export class DespesasService {
  constructor(
    @InjectRepository(Despesa)
    private despesaRepository: Repository<Despesa>,
  ) {}

  create(data: Partial<Despesa>) {
    const despesa = this.despesaRepository.create(data);
    return this.despesaRepository.save(despesa);
  }

  findAll() {
    return this.despesaRepository.find();
  }
  
  remove(id: number) {
  return this.despesaRepository.delete(id);
  }

    update(id: number, dados: any) {
    return this.despesaRepository.update(id, dados);
  }
}
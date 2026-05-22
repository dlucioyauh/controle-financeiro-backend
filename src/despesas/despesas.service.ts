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

  create(data: Partial<Despesa>, usuario: string) {
    const despesa = this.despesaRepository.create({ ...data, usuario });
    return this.despesaRepository.save(despesa);
  }

  findAll(usuario: string) {
    return this.despesaRepository.find({ where: { usuario } });
  }

  remove(id: number, usuario: string) {
    return this.despesaRepository.delete({ id, usuario });
  }

  update(id: number, dados: Partial<Despesa>, usuario: string) {
    return this.despesaRepository.update({ id, usuario }, dados);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DespesaEntity } from './despesa.entity';

@Injectable()
export class DespesasService {
  constructor(
    @InjectRepository(DespesaEntity)
    private despesasRepository: Repository<DespesaEntity>,
  ) {}

  async criar(userId: string, dados: any) {
    const novaDespesa = this.despesasRepository.create({
      ...dados,
      userId,
      // ✅ Garante que o âmbito seja definido, com fallback para 'EMPRESA'
      ambito: dados.ambito || 'EMPRESA',
    });
    return this.despesasRepository.save(novaDespesa);
  }

  async listar(userId: string) {
    // ✅ CORREÇÃO: Filtra por ambito 'EMPRESA' em vez de 'pessoal: false'
    return this.despesasRepository.find({
      where: { userId, ambito: 'EMPRESA' },
      order: { data: 'DESC' },
    });
  }

  async listarPessoais(userId: string) {
    // ✅ CORREÇÃO: Filtra por ambito 'PESSOAL' em vez de 'pessoal: true'
    return this.despesasRepository.find({
      where: { userId, ambito: 'PESSOAL' },
      order: { data: 'DESC' },
    });
  }

  async listarReceitasPessoais(userId: string) {
    // ✅ CORREÇÃO: Mesma lógica, buscando despesas de âmbito pessoal que funcionam como receita
    return this.despesasRepository.find({
      where: { userId, ambito: 'PESSOAL' },
      order: { data: 'DESC' },
    });
  }

  async buscarPorId(id: string, userId: string) {
    const despesa = await this.despesasRepository.findOne({
      where: { id, userId },
    });
    if (!despesa) {
      throw new NotFoundException('Despesa não encontrada');
    }
    return despesa;
  }

  async atualizar(id: string, userId: string, dados: any) {
    const despesa = await this.buscarPorId(id, userId);
    Object.assign(despesa, dados);
    return this.despesasRepository.save(despesa);
  }

  async remover(id: string, userId: string) {
    const despesa = await this.buscarPorId(id, userId);
    return this.despesasRepository.remove(despesa);
  }
}
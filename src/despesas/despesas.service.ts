import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DespesaEntity } from './despesa.entity';

@Injectable()
export class DespesasService {
  constructor(
    @InjectRepository(DespesaEntity)
    private despesasRepository: Repository<DespesaEntity>,
  ) {}

  async criar(dados: any) {
    const ambito = dados.ambito || (dados.pessoal ? 'PESSOAL' : 'EMPRESA');
    
    const novaDespesa = this.despesasRepository.create({
      ...dados,
      ambito,
    });
    return this.despesasRepository.save(novaDespesa);
  }

  async listar(userId: string, isPessoal: boolean, tipo?: string) {
    const where: any = { userId };
    where.ambito = isPessoal ? 'PESSOAL' : 'EMPRESA';
    
    // ✅ CORREÇÃO: Removido 'where.tipo = tipo' pois a coluna não existe na DespesaEntity.
    // A separação entre receita/despesa no âmbito pessoal é tratada pelo frontend ou via categoria.

    return this.despesasRepository.find({
      where,
      order: { data: 'DESC' },
    });
  }

  async listarPessoais(userId: string) {
    return this.despesasRepository.find({
      where: { userId, ambito: 'PESSOAL' },
      order: { data: 'DESC' },
    });
  }

  async listarReceitasPessoais(userId: string) {
    return this.despesasRepository.find({
      where: { userId, ambito: 'PESSOAL' },
      order: { data: 'DESC' },
    });
  }

  async buscarPorId(id: string) {
    const despesa = await this.despesasRepository.findOne({
      where: { id },
    });
    if (!despesa) {
      throw new NotFoundException('Despesa não encontrada');
    }
    return despesa;
  }

  async atualizar(id: string, dados: any) {
    const despesa = await this.buscarPorId(id);
    
    if (dados.pessoal !== undefined) {
      dados.ambito = dados.pessoal ? 'PESSOAL' : 'EMPRESA';
      delete dados.pessoal;
    }

    Object.assign(despesa, dados);
    return this.despesasRepository.save(despesa);
  }

  async remover(id: string) {
    const despesa = await this.buscarPorId(id);
    return this.despesasRepository.remove(despesa);
  }

  async getTotais(userId: string, isPessoal: boolean, tipo?: string) {
    const where: any = { userId };
    where.ambito = isPessoal ? 'PESSOAL' : 'EMPRESA';

    const registros = await this.despesasRepository.find({ where });
    const total = registros.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
    
    return {
      total,
      quantidade: registros.length,
    };
  }
}
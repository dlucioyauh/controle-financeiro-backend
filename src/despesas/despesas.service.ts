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
    // ✅ Garante que o tipo seja salvo em maiúsculo para bater com o enum
    const tipo = dados.tipo ? dados.tipo.toUpperCase() : 'DESPESA';
    
    const novaDespesa = this.despesasRepository.create({
      ...dados,
      ambito,
      tipo,
    });
    return this.despesasRepository.save(novaDespesa);
  }

  async listar(userId: string, isPessoal: boolean, tipo?: string) {
    const where: any = { userId };
    where.ambito = isPessoal ? 'PESSOAL' : 'EMPRESA';
    
    // ✅ Filtra por tipo se fornecido (ex: 'RECEITA' ou 'DESPESA')
    if (tipo) {
      where.tipo = tipo.toUpperCase();
    }

    return this.despesasRepository.find({
      where,
      order: { data: 'DESC' },
    });
  }

  // ✅ Agora filtra APENAS despesas pessoais
  async listarPessoais(userId: string) {
    return this.despesasRepository.find({
      where: { userId, ambito: 'PESSOAL', tipo: 'DESPESA' },
      order: { data: 'DESC' },
    });
  }

  // ✅ Agora filtra APENAS receitas pessoais
  async listarReceitasPessoais(userId: string) {
    return this.despesasRepository.find({
      where: { userId, ambito: 'PESSOAL', tipo: 'RECEITA' },
      order: { data: 'DESC' },
    });
  }

  async buscarPorId(id: string) {
    const item = await this.despesasRepository.findOne({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    return item;
  }

  async atualizar(id: string, dados: any) {
    const item = await this.buscarPorId(id);
    
    if (dados.pessoal !== undefined) {
      dados.ambito = dados.pessoal ? 'PESSOAL' : 'EMPRESA';
      delete dados.pessoal;
    }
    if (dados.tipo) {
      dados.tipo = dados.tipo.toUpperCase();
    }

    Object.assign(item, dados);
    return this.despesasRepository.save(item);
  }

  async remover(id: string) {
    const item = await this.buscarPorId(id);
    return this.despesasRepository.remove(item);
  }

  async getTotais(userId: string, isPessoal: boolean, tipo?: string) {
    const where: any = { userId };
    where.ambito = isPessoal ? 'PESSOAL' : 'EMPRESA';

    if (tipo) {
      where.tipo = tipo.toUpperCase();
    }

    const registros = await this.despesasRepository.find({ where });
    const total = registros.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
    
    return {
      total,
      quantidade: registros.length,
    };
  }
}
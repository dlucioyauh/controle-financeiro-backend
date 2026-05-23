import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendaEntity } from './venda.entity.js';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(VendaEntity)
    private repo: Repository<VendaEntity>,
  ) {}

  async criar(dadosVenda: Partial<VendaEntity>, username: string): Promise<VendaEntity> {
    const novaVenda = this.repo.create({ ...dadosVenda, usuario: username });
    return this.repo.save(novaVenda);
  }

  async listarTodas(username: string): Promise<VendaEntity[]> {
    return this.repo.find({
      where: { usuario: username },
      order: { dataVenda: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, data: Partial<VendaEntity>) {
    await this.repo.update(id, data);
    return this.repo.findOneBy({ id });
  }

  async remove(id: string, username: string) {
    const venda = await this.repo.findOneBy({ id });
    if (venda && venda.usuario !== username) {
      throw new UnauthorizedException('Você não tem permissão para remover esta venda.');
    }
    return this.repo.delete(id);
  }

  async estatisticas(dataInicio: string, dataFim: string, username: string) {
    const todasVendas = await this.repo.find({ where: { usuario: username } });
    const vendas = (todasVendas as any[]).filter((v) => {
      if (!dataInicio || !dataFim) return true;
      try {
        const dataVenda = new Date(v.dataVenda).toISOString().split('T')[0];
        return dataVenda >= dataInicio && dataVenda <= dataFim;
      } catch {
        return true;
      }
    });

    const totalReceita = vendas.reduce((acc, v) => acc + Number(v.valorTotal || 0), 0);
    const totalVendas = vendas.length;
    const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;

    const produtosMap: Record<string, { nome: string; quantidade: number; receita: number }> = {};
    vendas.forEach((v) => {
      const nomeProd = v.produto || 'Item Geral';
      if (!produtosMap[nomeProd]) {
        produtosMap[nomeProd] = { nome: nomeProd, quantidade: 0, receita: 0 };
      }
      produtosMap[nomeProd].quantidade += Number(v.quantidade || 1);
      produtosMap[nomeProd].receita += Number(v.valorTotal || 0);
    });

    const produtosMaisVendidos = Object.values(produtosMap)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    const canaisMap: Record<string, number> = {};
    vendas.forEach((v) => {
      const canal = v.canalVenda || 'Balcão';
      canaisMap[canal] = (canaisMap[canal] || 0) + Number(v.valorTotal || 0);
    });

    const vendasPorDia: Record<string, number> = {};
    vendas.forEach((v) => {
      try {
        const dia = new Date(v.dataVenda).toISOString().split('T')[0];
        vendasPorDia[dia] = (vendasPorDia[dia] || 0) + Number(v.valorTotal || 0);
      } catch {
        vendasPorDia['Histórico'] = (vendasPorDia['Histórico'] || 0) + Number(v.valorTotal || 0);
      }
    });

    return { totalReceita, totalVendas, ticketMedio, produtosMaisVendidos, canaisMap, vendasPorDia };
  }

  async estatisticasClientes(dataInicio: string, dataFim: string, username: string) {
    const todasVendas = await this.repo.find({ where: { usuario: username } });
    const vendas = todasVendas.filter((v) => {
      if (!dataInicio || !dataFim) return true;
      try {
        const dataVenda = new Date(v.dataVenda).toISOString().split('T')[0];
        return dataVenda >= dataInicio && dataVenda <= dataFim;
      } catch {
        return true;
      }
    });

    const clientesMap: Record<string, { nome: string; pedidos: number; faturamento: number }> = {};
    vendas.forEach((v) => {
      const id = v.clienteId || '__sem_cliente__';
      const nome = v.clienteNome || 'Sem cliente';
      if (!clientesMap[id]) clientesMap[id] = { nome, pedidos: 0, faturamento: 0 };
      clientesMap[id].pedidos += 1;
      clientesMap[id].faturamento += Number(v.valorTotal || 0);
    });

    return Object.values(clientesMap)
      .sort((a, b) => b.faturamento - a.faturamento)
      .slice(0, 10);
  }
}
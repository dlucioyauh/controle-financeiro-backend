import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { VendaEntity } from './venda.entity';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(VendaEntity)
    private vendaRepository: Repository<VendaEntity>,
  ) {}

  // --- CRUD ---
  async criar(data: Partial<VendaEntity>): Promise<VendaEntity> {
    const venda = this.vendaRepository.create(data);
    return this.vendaRepository.save(venda);
  }

  async listar(): Promise<VendaEntity[]> {
    return this.vendaRepository.find({ order: { dataVenda: 'DESC' } });
  }

  async buscarPorId(id: string): Promise<VendaEntity> {
    const venda = await this.vendaRepository.findOne({ where: { id } });
    if (!venda) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }
    return venda;
  }

  async atualizar(
    id: string,
    data: Partial<VendaEntity>,
  ): Promise<VendaEntity> {
    const venda = await this.buscarPorId(id);
    Object.assign(venda, data);
    return this.vendaRepository.save(venda);
  }

  async remover(id: string): Promise<void> {
    const resultado = await this.vendaRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }
  }

  // --- ESTATÍSTICAS ---
  async getEstatisticas(
    usuario: string,
    dataInicio: string,
    dataFim: string,
  ) {
    const qb = this.vendaRepository
      .createQueryBuilder('v')
      .where('v.usuario = :usuario', { usuario })
      .andWhere('v.dataVenda BETWEEN :inicio AND :fim', {
        inicio: dataInicio,
        fim: dataFim + ' 23:59:59',
      });

    const vendas = await qb.getMany();

    // Calcular totais
    const totalReceita = vendas.reduce((sum, v) => sum + Number(v.valorTotal), 0);
    const totalVendas = vendas.length;
    const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;

    // Produtos mais vendidos
    const produtosMap: Record<string, { nome: string; quantidade: number; receita: number }> = {};
    vendas.forEach((v) => {
      const nome = v.produto;
      if (!produtosMap[nome]) {
        produtosMap[nome] = { nome, quantidade: 0, receita: 0 };
      }
      produtosMap[nome].quantidade += Number(v.quantidade);
      produtosMap[nome].receita += Number(v.valorTotal);
    });
    const produtosMaisVendidos = Object.values(produtosMap)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Canais de venda
    const canaisMap: Record<string, number> = {};
    vendas.forEach((v) => {
      const canal = v.canalVenda || 'Balcão';
      canaisMap[canal] = (canaisMap[canal] || 0) + Number(v.valorTotal);
    });

    // Vendas por dia
    const vendasPorDia: Record<string, number> = {};
    vendas.forEach((v) => {
      const dia = new Date(v.dataVenda).toISOString().split('T')[0];
      vendasPorDia[dia] = (vendasPorDia[dia] || 0) + Number(v.valorTotal);
    });

    return {
      totalReceita,
      totalVendas,
      ticketMedio,
      produtosMaisVendidos,
      canaisMap,
      vendasPorDia,
    };
  }

  async getTopClientes(
    usuario: string,
    dataInicio: string,
    dataFim: string,
  ) {
    const qb = this.vendaRepository
      .createQueryBuilder('v')
      .select('v.clienteNome', 'nome')
      .addSelect('COUNT(v.id)', 'pedidos')
      .addSelect('SUM(v.valorTotal)', 'faturamento')
      .where('v.usuario = :usuario', { usuario })
      .andWhere('v.dataVenda BETWEEN :inicio AND :fim', {
        inicio: dataInicio,
        fim: dataFim + ' 23:59:59',
      })
      .groupBy('v.clienteNome')
      .orderBy('faturamento', 'DESC')
      .limit(10);

    const raw = await qb.getRawMany();
    return raw.map((r) => ({
      nome: r.nome || 'Cliente não identificado',
      pedidos: Number(r.pedidos),
      faturamento: Number(r.faturamento),
    }));
  }
}
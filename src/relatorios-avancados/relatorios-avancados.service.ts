import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';
import { VendaEntity } from '../vendas/venda.entity';
import { DespesaEntity } from '../despesas/despesa.entity';
import { RelatorioFiltrosDto } from './dto/relatorio-filtros.dto';

@Injectable()
export class RelatoriosAvancadosService {
  private readonly logger = new Logger(RelatoriosAvancadosService.name);

  constructor(
    @InjectRepository(VendaEntity)
    private vendasRepo: Repository<VendaEntity>,
    @InjectRepository(DespesaEntity)
    private despesasRepo: Repository<DespesaEntity>,
  ) {}

  private buildDateFilter(dataInicio?: string, dataFim?: string) {
    if (dataInicio && dataFim) return Between(new Date(dataInicio), new Date(dataFim));
    if (dataInicio) return Between(new Date(dataInicio), new Date());
    if (dataFim) return Between(new Date('2000-01-01'), new Date(dataFim));
    return undefined;
  }

  async getResumoGeral(usuario: string, filtros: RelatorioFiltrosDto) {
    try {
      const { dataInicio, dataFim, clienteId, produto } = filtros;
      const dateFilter = this.buildDateFilter(dataInicio, dataFim);

      let vendas: VendaEntity[] = [];
      let totalVendas = 0;
      if (filtros.tipo !== 'despesa') {
        const whereVendas: any = { usuario };
        if (dateFilter) whereVendas.dataVenda = dateFilter;
        if (clienteId) whereVendas.clienteId = clienteId;  // ← campo direto, sem relation
        if (produto) whereVendas.produto = ILike(`%${produto}%`);
        vendas = await this.vendasRepo.find({ where: whereVendas });
        totalVendas = vendas.reduce((acc, v) => acc + Number(v.valorTotal), 0);
      }

      let despesas: DespesaEntity[] = [];
      let totalDespesas = 0;
      if (filtros.tipo !== 'venda') {
        const whereDespesas: any = { usuario, pessoal: false };
        if (dateFilter) whereDespesas.data = dateFilter;
        despesas = await this.despesasRepo.find({ where: whereDespesas });
        totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor), 0);
      }

      const lucro = totalVendas - totalDespesas;
      const ticketMedio = vendas.length ? totalVendas / vendas.length : 0;

      const produtosMap = new Map<string, { quantidade: number; receita: number }>();
      vendas.forEach(v => {
        const nome = v.produto || 'Item Geral';
        const dados = produtosMap.get(nome) || { quantidade: 0, receita: 0 };
        dados.quantidade += Number(v.quantidade || 1);
        dados.receita += Number(v.valorTotal);
        produtosMap.set(nome, dados);
      });
      const topProdutos = Array.from(produtosMap.entries())
        .map(([nome, dados]) => ({ nome, ...dados }))
        .sort((a, b) => b.receita - a.receita)
        .slice(0, 5);

      const vendasPorDia = vendas.reduce((acc, v) => {
        const data = new Date(v.dataVenda).toISOString().split('T')[0];
        acc[data] = (acc[data] || 0) + Number(v.valorTotal);
        return acc;
      }, {} as Record<string, number>);
      const evolucao = Object.entries(vendasPorDia).map(([data, valor]) => ({ data, valor }));

      return {
        totalVendas,
        totalDespesas,
        lucro,
        ticketMedio,
        totalTransacoes: vendas.length + despesas.length,
        topProdutos,
        evolucao,
        vendas,
        despesas,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Erro em getResumoGeral: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Falha ao gerar relatório. Verifique os logs.');
    }
  }
}
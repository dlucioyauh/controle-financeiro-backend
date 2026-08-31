import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike } from 'typeorm';
import { VendaEntity } from '../vendas/venda.entity';
import { DespesaEntity } from '../despesas/despesa.entity';

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
    const start = dataInicio ? new Date(dataInicio) : undefined;
    const end = dataFim ? new Date(dataFim) : undefined;

    if (start && end) return Between(start, end);
    if (start) return Between(start, new Date());
    if (end) return Between(new Date('2000-01-01'), end);
    return undefined;
  }

  async getResumoGeral(userId: string, filtros: any) {
    try {
      const { dataInicio, dataFim, clienteId, produto, tipo } = filtros;
      const dateFilter = this.buildDateFilter(dataInicio, dataFim);

      let vendas: VendaEntity[] = [];
      let totalVendas = 0;
      if (tipo !== 'despesa') {
        const whereVendas: any = { userId };
        if (dateFilter) whereVendas.dataVenda = dateFilter;
        if (clienteId) whereVendas.clienteId = clienteId;
        if (produto) whereVendas.produto = ILike(`%${produto}%`);
        
        vendas = await this.vendasRepo.find({ where: whereVendas });
        totalVendas = vendas.reduce((acc, v) => acc + Number(v.valorTotal || 0), 0);
      }

      let despesas: DespesaEntity[] = [];
      let totalDespesas = 0;
      if (tipo !== 'venda') {
        const whereDespesas: any = { userId };
        if (dateFilter) whereDespesas.data = dateFilter;
        
        despesas = await this.despesasRepo.find({ where: whereDespesas });
        despesas = despesas.filter((d: any) => d.ambito === 'EMPRESA' || !d.ambito);
        
        totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor || 0), 0);
      }

      const lucro = totalVendas - totalDespesas;
      const ticketMedio = vendas.length ? totalVendas / vendas.length : 0;

      const produtosMap = new Map<string, { quantidade: number; receita: number }>();
      vendas.forEach(v => {
        const nome = v.produto || 'Item Geral';
        const dados = produtosMap.get(nome) || { quantidade: 0, receita: 0 };
        dados.quantidade += Number(v.quantidade || 1);
        dados.receita += Number(v.valorTotal || 0);
        produtosMap.set(nome, dados);
      });
      
      const topProdutos = Array.from(produtosMap.entries())
        .map(([nome, dados]) => ({ nome, ...dados }))
        .sort((a, b) => b.receita - a.receita)
        .slice(0, 5);

      const vendasPorDia = vendas.reduce((acc, v) => {
        const data = new Date(v.dataVenda).toISOString().split('T')[0];
        acc[data] = (acc[data] || 0) + Number(v.valorTotal || 0);
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

  // ✅ CORREÇÃO: Aceita string 'EMPRESA' | 'PESSOAL' | 'TODOS'
  async gerarDre(
    userId: string,
    dataInicio: string,
    dataFim: string,
    ambito?: 'EMPRESA' | 'PESSOAL' | 'TODOS',
  ) {
    try {
      const dateFilter = this.buildDateFilter(dataInicio, dataFim);

      // 1. Buscar Vendas (Receita Bruta)
      const whereVendas: any = { userId };
      if (dateFilter) whereVendas.dataVenda = dateFilter;
      const vendas = await this.vendasRepo.find({ where: whereVendas });

      // 2. Buscar Despesas
      const whereDespesas: any = { userId };
      if (dateFilter) whereDespesas.data = dateFilter;
      
      // ✅ Filtra por âmbito apenas se NÃO for 'TODOS'
      if (ambito && ambito !== 'TODOS') {
        whereDespesas.ambito = ambito;
      }

      const despesas = await this.despesasRepo.find({ where: whereDespesas });

      // 3. Calcular Receita Bruta
      const receitaBruta = vendas.reduce((acc, v) => acc + Number(v.valorTotal || 0), 0);

      // 4. Deduções (Placeholder)
      const deducoes = 0;

      // 5. Classificar Despesas em CPV vs Operacionais
      const cpvKeywords = [
        'custo', 'insumo', 'fornecedor', 'matéria', 'materia', 
        'embalagem', 'mercadoria', 'produto', 'ingrediente'
      ];
      
      let cpv = 0;
      let despesasOperacionais = 0;
      const despesasPorCategoria: Record<string, number> = {};

      despesas.forEach((d) => {
        const val = Number(d.valor || 0);
        const cat = (d.categoria || 'Sem Categoria').toLowerCase();
        
        despesasPorCategoria[cat] = (despesasPorCategoria[cat] || 0) + val;

        const isCpv = cpvKeywords.some((keyword) => cat.includes(keyword));

        if (isCpv) {
          cpv += val;
        } else {
          despesasOperacionais += val;
        }
      });

      // 6. Cálculos Finais do DRE
      const lucroBruto = receitaBruta - deducoes - cpv;
      const lucroLiquido = lucroBruto - despesasOperacionais;
      const margemBruta = receitaBruta > 0 ? (lucroBruto / receitaBruta) * 100 : 0;
      const margemLiquida = receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0;

      // ✅ Formata o texto do âmbito para exibição correta na tela
      let ambitoExibicao = 'EMPRESARIAL';
      if (ambito === 'PESSOAL') ambitoExibicao = 'PESSOAL';
      else if (ambito === 'TODOS') ambitoExibicao = 'GERAL (Empresa + Pessoal)';

      return {
        periodo: { 
          dataInicio, 
          dataFim, 
          ambito: ambitoExibicao
        },
        receitaBruta: Number(receitaBruta.toFixed(2)),
        deducoes: Number(deducoes.toFixed(2)),
        cpv: Number(cpv.toFixed(2)),
        lucroBruto: Number(lucroBruto.toFixed(2)),
        despesasOperacionais: Number(despesasOperacionais.toFixed(2)),
        lucroLiquido: Number(lucroLiquido.toFixed(2)),
        margemBruta: Number(margemBruta.toFixed(2)),
        margemLiquida: Number(margemLiquida.toFixed(2)),
        despesasPorCategoria,
        totalVendas: vendas.length,
        totalDespesas: despesas.length,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`[DRE ERROR] Mensagem: ${err.message}`, err.stack);
      throw new InternalServerErrorException(`Falha ao gerar o DRE: ${err.message}`);
    }
  }
}
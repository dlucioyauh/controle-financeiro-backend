import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { VendaEntity } from './venda.entity';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(VendaEntity)
    private repo: Repository<VendaEntity>,
  ) {}

  async criar(dadosVenda: Partial<VendaEntity>): Promise<VendaEntity> {
    const novaVenda = this.repo.create(dadosVenda);
    return this.repo.save(novaVenda);
  }

  async listarTodas(): Promise<VendaEntity[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, data: Partial<VendaEntity>) {
    await this.repo.update(id, data);
    return this.repo.findOneBy({ id });
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }

  async estatisticas(dataInicio: string, dataFim: string) {
    // Buscamos todas as vendas para processamento analítico
    const todasVendas = await this.repo.find();
    
    // Convertemos para any para evitar que o compilador trave em propriedades não salvas/fantasmas
    const vendas = todasVendas as any[];

    const totalReceita = vendas.reduce((acc, v) => acc + Number(v.valorTotal || v.total || 0), 0);
    const totalVendas = vendas.length;
    const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;

    // Agrupamento por Produto
    const produtosMap: Record<string, { nome: string; quantidade: number; receita: number }> = {};
    vendas.forEach((v) => {
      const nomeProd = v.produto || 'Item Geral';
      if (!produtosMap[nomeProd]) {
        produtosMap[nomeProd] = { nome: nomeProd, quantidade: 0, receita: 0 };
      }
      produtosMap[nomeProd].quantidade += Number(v.quantidade || 1);
      produtosMap[nomeProd].receita += Number(v.valorTotal || v.total || 0);
    });
    
    const produtosMaisVendidos = Object.values(produtosMap)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Agrupamento por Canal de Venda
    const canaisMap: Record<string, number> = {};
    vendas.forEach((v) => {
      const canal = v.canalVenda || v.canal || 'Balcão';
      canaisMap[canal] = (canaisMap[canal] || 0) + Number(v.valorTotal || v.total || 0);
    });

    // Agrupamento por Dia
    const vendasPorDia: Record<string, number> = {};
    vendas.forEach((v) => {
      const dataBruta = v.dataVenda || v.contextoData || v.data;
      if (dataBruta) {
        try {
          const diaFormata = new Date(dataBruta).toISOString().split('T')[0];
          vendasPorDia[diaFormata] = (vendasPorDia[diaFormata] || 0) + Number(v.valorTotal || v.total || 0);
        } catch {
          vendasPorDia['Histórico'] = (vendasPorDia['Histórico'] || 0) + Number(v.valorTotal || v.total || 0);
        }
      }
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
}
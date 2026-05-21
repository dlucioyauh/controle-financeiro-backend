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
    // Vincula a nova venda ao usuário logado antes de salvar
    const novaVenda = this.repo.create({ ...dadosVenda, usuario: username });
    return this.repo.save(novaVenda);
  }

  async listarTodas(username: string): Promise<VendaEntity[]> {
    // Traz apenas as vendas onde a coluna 'usuario' for igual ao usuário logado
    return this.repo.find({ 
      where: { usuario: username },
      order: { dataVenda: 'DESC' } 
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
    // Garante que o usuário só consiga deletar uma venda que pertence a ele mesmo
    const venda = await this.repo.findOneBy({ id });
    if (venda && venda.usuario !== username) {
      throw new UnauthorizedException('Você não tem permissão para remover esta venda.');
    }
    return this.repo.delete(id);
  }

  async estatisticas(dataInicio: string, dataFim: string, username: string) {
    // O Analytics agora processa apenas o faturamento do próprio usuário
    const todasVendas = await this.repo.find({ where: { usuario: username } });
    const vendas = todasVendas as any[];

    const totalReceita = vendas.reduce((acc, v) => acc + Number(v.valorTotal || v.total || 0), 0);
    const totalVendas = vendas.length;
    const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;

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

    const canaisMap: Record<string, number> = {};
    vendas.forEach((v) => {
      const canal = v.canalVenda || v.canal || 'Balcão';
      canaisMap[canal] = (canaisMap[canal] || 0) + Number(v.valorTotal || v.total || 0);
    });

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
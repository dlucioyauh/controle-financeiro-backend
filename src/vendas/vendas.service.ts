import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Venda } from './venda.entity';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(Venda)
    private repo: Repository<Venda>,
  ) {}

  findAll() {
    return this.repo.find({ order: { data: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Venda>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<Venda>) {
    return this.repo.update(id, data).then(() => this.repo.findOneBy({ id }));
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  async estatisticas(dataInicio: string, dataFim: string) {
    const vendas = await this.repo.find({
      where: {
        data: Between(dataInicio, dataFim),
      },
      order: { data: 'ASC' },
    });

    const totalReceita = vendas.reduce((acc, v) => acc + Number(v.total), 0);
    const totalVendas = vendas.length;
    const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;

    // Produtos mais vendidos
    const produtosMap: Record<string, { nome: string; quantidade: number; receita: number }> = {};
    vendas.forEach((v) => {
      v.itens?.forEach((item) => {
        if (!produtosMap[item.nomeProduto]) {
          produtosMap[item.nomeProduto] = { nome: item.nomeProduto, quantidade: 0, receita: 0 };
        }
        produtosMap[item.nomeProduto].quantidade += item.quantidade;
        produtosMap[item.nomeProduto].receita += item.subtotal;
      });
    });
    const produtosMaisVendidos = Object.values(produtosMap)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Vendas por canal
    const canaisMap: Record<string, number> = {};
    vendas.forEach((v) => {
      canaisMap[v.canal] = (canaisMap[v.canal] || 0) + Number(v.total);
    });

    // Vendas por dia
    const vendasPorDia: Record<string, number> = {};
    vendas.forEach((v) => {
      vendasPorDia[v.data] = (vendasPorDia[v.data] || 0) + Number(v.total);
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
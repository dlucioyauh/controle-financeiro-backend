import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VendaEntity } from './venda.entity';
import { UsersService } from '../users/users.service';
import { ClientesService } from '../clientes/clientes.service';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(VendaEntity)
    private vendaRepository: Repository<VendaEntity>,
    private usersService: UsersService,
    private clientesService: ClientesService,
    private configService: ConfigService,
  ) {}

  // --- CRUD ---
  async criar(data: Partial<VendaEntity>): Promise<VendaEntity> {
    const venda = this.vendaRepository.create(data);
    return this.vendaRepository.save(venda);
  }

  async listar(): Promise<VendaEntity[]> {
    return this.vendaRepository.find({ order: { dataVenda: 'DESC' } });
  }

  async listarPorUsuario(usuario: string): Promise<VendaEntity[]> {
    return this.vendaRepository.find({
      where: { usuario },
      order: { dataVenda: 'DESC' },
    });
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
  async getEstatisticas(usuario: string, dataInicio: string, dataFim: string) {
    console.log('### getEstatisticas chamado ###');
    console.log('usuario:', usuario);
    console.log('dataInicio:', dataInicio);
    console.log('dataFim:', dataFim);

    const vendas = await this.vendaRepository
      .createQueryBuilder('v')
      .where('v.usuario = :usuario', { usuario })
      .andWhere('v.dataVenda BETWEEN :inicio AND :fim', {
        inicio: dataInicio,
        fim: dataFim + ' 23:59:59',
      })
      .getMany();

    console.log('vendas encontradas:', vendas.length);

    const totalReceita = vendas.reduce((sum, v) => sum + Number(v.valorTotal), 0);
    const totalVendas = vendas.length;
    const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;

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

    const canaisMap: Record<string, number> = {};
    vendas.forEach((v) => {
      const canal = v.canalVenda || 'Balcão';
      canaisMap[canal] = (canaisMap[canal] || 0) + Number(v.valorTotal);
    });

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

  async getTopClientes(usuario: string, dataInicio: string, dataFim: string) {
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

  // --- FRETE ---
  async calcularFrete(usuario: string, clienteId: string) {
    const user = await this.usersService.findOne(usuario);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (!user.latitudeOrigem || !user.longitudeOrigem) {
      throw new NotFoundException('Endereço de origem não configurado. Configure nas Configurações.');
    }

    const cliente = await this.clientesService.buscarPorId(clienteId);
    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    if (!cliente.latitude || !cliente.longitude) {
      throw new NotFoundException('Endereço do cliente não possui coordenadas.');
    }

    const apiKey = this.configService.get('ORS_API_KEY');
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const body = {
      coordinates: [
        [user.longitudeOrigem, user.latitudeOrigem],
        [cliente.longitude, cliente.latitude],
      ],
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      throw new Error(`Erro na API de roteirização: ${resp.statusText}`);
    }

    const data = await resp.json();
    const route = data.routes[0].summary;
    const distanciaKm = route.distance / 1000;
    const tempoMinutos = Math.round(route.duration / 60);

    const taxa = Number(user.taxaFreteKm) || 0.8;
    const valorFrete = distanciaKm * taxa;

    return {
      distanciaKm: distanciaKm.toFixed(2),
      tempoMinutos,
      valorFrete: valorFrete.toFixed(2),
      taxaFreteKm: taxa,
    };
  }
}
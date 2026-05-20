import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('vendas')
@UseGuards(AuthGuard) // Garante segurança via JWT
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  async criarVenda(@Body() dadosVenda: Partial<VendaEntity>): Promise<VendaEntity> {
    // Garante o cálculo do valor total caso venha zerado por segurança
    if (dadosVenda.quantidade && dadosVenda.precoUnitario) {
      dadosVenda.valorTotal = dadosVenda.quantidade * dadosVenda.precoUnitario;
    }
    return this.vendasService.criar(dadosVenda);
  }

  @Get()
  async listarTodasVendas(): Promise<VendaEntity[]> {
    return this.vendasService.listarTodas();
  }
}
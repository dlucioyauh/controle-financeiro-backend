import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { VendasService } from './vendas.service.js';
import { VendaEntity } from './venda.entity.js';
// Ajustado para o nome real do arquivo: auth.guard.js
import { AuthGuard } from '../auth/auth.guard.js'; 

@Controller('vendas')
@UseGuards(AuthGuard) // Atualizado para usar o AuthGuard correto
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  criar(@Body() dadosVenda: Partial<VendaEntity>) {
    return this.vendasService.criar(dadosVenda);
  }

  @Get()
  listarTodas() {
    return this.vendasService.listarTodas();
  }

  // ROTA DO ANALYTICS
  @Get('estatisticas')
  obterEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.vendasService.estatisticas(dataInicio, dataFim);
  }
}
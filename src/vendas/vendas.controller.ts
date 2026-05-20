import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { VendasService } from './vendas.service.js';
import { VendaEntity } from './venda.entity.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('vendas')
@UseGuards(AuthGuard)
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

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.vendasService.remove(id);
  }

  @Get('estatisticas')
  obterEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.vendasService.estatisticas(dataInicio, dataFim);
  }
}
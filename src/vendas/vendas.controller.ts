import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Garanta que o caminho do seu Guard está correto

@Controller('vendas')
@UseGuards(JwtAuthGuard) // Protege todas as rotas de vendas com o JWT
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

  // NOVA ROTA: Captura as queries (?dataInicio=...&dataFim=...) enviadas pelo frontend
  @Get('estatisticas')
  obterEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.vendasService.estatisticas(dataInicio, dataFim);
  }
}
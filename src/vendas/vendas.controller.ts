import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { VendasService } from './vendas.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('vendas')
@UseGuards(AuthGuard)
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  criar(@Body() dadosVenda: any, @Req() req: any) {
    return this.vendasService.criar(dadosVenda, req.user.username);
  }

  @Get()
  listarTodas(@Req() req: any) {
    return this.vendasService.listarTodas(req.user.username);
  }

  @Delete(':id')
  remover(@Param('id') id: string, @Req() req: any) {
    return this.vendasService.remove(id, req.user.username);
  }

  @Get('estatisticas')
  obterEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: any,
  ) {
    return this.vendasService.estatisticas(dataInicio, dataFim, req.user.username);
  }

  @Get('estatisticas-clientes')
  obterEstatisticasClientes(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: any,
  ) {
    return this.vendasService.estatisticasClientes(dataInicio, dataFim, req.user.username);
  }
}
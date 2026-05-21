import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { VendasService } from './vendas.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('vendas')
@UseGuards(AuthGuard)
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  criar(@Body() dadosVenda: any, @Req() req: any) {
    const username = req.user.username; 
    return this.vendasService.criar(dadosVenda, username);
  }

  @Get()
  listarTodas(@Req() req: any) {
    const username = req.user.username; // 🔒 Captura o usuário logado
    return this.vendasService.listarTodas(username); // 🔑 Passa o username aqui
  }

  @Delete(':id')
  async remover(@Param('id') id: string, @Req() req: any) {
    const username = req.user.username; // 🔒 Captura o usuário logado
    return this.vendasService.remove(id, username); // 🔑 Passa o username aqui
  }

  @Get('estatisticas')
  obterEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: any
  ) {
    const username = req.user.username; // 🔒 Captura o usuário logado
    return this.vendasService.estatisticas(dataInicio, dataFim, username); // 🔑 Passa o username aqui
  }
}
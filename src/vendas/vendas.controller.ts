import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoGuard, RequerPlano } from '../auth/plano.guard';
import { LimiteVendasGuard } from './limite-vendas.guard';   // ← novo
import type { Request } from 'express';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @UseGuards(AuthGuard, LimiteVendasGuard)   // ← adicionado LimiteVendasGuard
  @Post()
  criar(@Body() data: Partial<VendaEntity>, @Req() req: Request): Promise<VendaEntity> {
    const usuario = (req as any).user?.username;
    return this.vendasService.criar({ ...data, usuario });
  }

  @UseGuards(AuthGuard)
  @Get()
  listar(@Req() req: Request): Promise<VendaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.vendasService.listarPorUsuario(usuario);
  }

  @UseGuards(AuthGuard, PlanoGuard)
  @RequerPlano('pro')
  @Post('calcular-frete')
  async calcularFrete(@Req() req: Request, @Body() body: { clienteId: string }) {
    const usuario = (req as any).user?.username;
    return this.vendasService.calcularFrete(usuario, body.clienteId);
  }

  // Relatórios – exigem plano Basic ou superior
  @UseGuards(AuthGuard, PlanoGuard)
  @RequerPlano('basic')
  @Get('estatisticas')
  async getEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: Request,
  ) {
    const usuario = (req as any).user?.username;
    return this.vendasService.getEstatisticas(usuario, dataInicio, dataFim);
  }

  @UseGuards(AuthGuard, PlanoGuard)
  @RequerPlano('basic')
  @Get('estatisticas-clientes')
  async getEstatisticasClientes(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: Request,
  ) {
    const usuario = (req as any).user?.username;
    return this.vendasService.getTopClientes(usuario, dataInicio, dataFim);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<VendaEntity> {
    return this.vendasService.buscarPorId(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<VendaEntity>,
  ): Promise<VendaEntity> {
    return this.vendasService.atualizar(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.vendasService.remover(id);
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { AuthGuard } from '../auth/auth.guard';
// import { PlanoGuard } from '../auth/plano.guard'; ← removido
import type { Request } from 'express';

@Controller('vendas')
@UseGuards(AuthGuard) // apenas autenticação, sem plano guard
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  create(@Body() createVendaDto: any, @Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.vendasService.criar({ ...createVendaDto, usuario });
  }

  @Get()
  findAll(@Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.vendasService.listarPorUsuario(usuario);
  }

  @Get('estatisticas')
  async getEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: Request,
  ) {
    const usuario = (req as any).user?.username;
    return this.vendasService.getEstatisticas(usuario, dataInicio, dataFim);
  }

  @Get('estatisticas-clientes')
  async getEstatisticasClientes(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: Request,
  ) {
    const usuario = (req as any).user?.username;
    return this.vendasService.getTopClientes(usuario, dataInicio, dataFim);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendasService.buscarPorId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendasService.remover(id);
  }
}
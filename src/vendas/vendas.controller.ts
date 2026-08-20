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
import type { Request } from 'express';

@Controller('vendas')
@UseGuards(AuthGuard)
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  create(@Body() createVendaDto: any, @Req() req: Request) {
    const user = (req as any).user;
    return this.vendasService.criar(createVendaDto, user.userId, user.username);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = (req as any).user;
    return this.vendasService.listarPorUsuario(user.userId);
  }

  @Get('estatisticas')
  getEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.vendasService.getEstatisticas(user.userId, dataInicio, dataFim);
  }

  @Get('estatisticas-clientes')
  getEstatisticasClientes(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.vendasService.getTopClientes(user.userId, dataInicio, dataFim);
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
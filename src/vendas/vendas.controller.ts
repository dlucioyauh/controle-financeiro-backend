import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  criar(@Body() data: Partial<VendaEntity>): Promise<VendaEntity> {
    return this.vendasService.criar(data);
  }

  @Get()
  listar(): Promise<VendaEntity[]> {
    return this.vendasService.listar();
  }

  // --- ESTATÍSTICAS (protegidas) ---
  @UseGuards(AuthGuard)
  @Get('estatisticas')
  async getEstatisticas(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
    @Req() req: Request,
  ) {
    const usuario = (req as any).user?.username;
    return this.vendasService.getEstatisticas(usuario, dataInicio, dataFim);
  }

  @UseGuards(AuthGuard)
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
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<VendaEntity> {
    return this.vendasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<VendaEntity>,
  ): Promise<VendaEntity> {
    return this.vendasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.vendasService.remover(id);
  }
}
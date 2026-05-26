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

  @UseGuards(AuthGuard)
  @Post()
  criar(
    @Body() data: Partial<VendaEntity>,
    @Req() req: Request,
  ): Promise<VendaEntity> {
    const usuario = (req as any).user?.username;
    return this.vendasService.criar({ ...data, usuario }); // ← INCLUI usuario
  }

  @UseGuards(AuthGuard)
  @Get()
  listar(@Req() req: Request): Promise<VendaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.vendasService.listarPorUsuario(usuario);
  }

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
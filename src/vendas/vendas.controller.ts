import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoGuard } from '../auth/plano.guard';
import type { Request } from 'express';

@Controller('vendas')
@UseGuards(AuthGuard, PlanoGuard) // aplica os dois guards em todas as rotas
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  criar(
    @Body() data: any,
    @Req() req: Request,
  ): Promise<VendaEntity> {
    const usuario = (req as any).user?.username;
    return this.vendasService.criar({ ...data, usuario });
  }

  @Get()
  listar(@Req() req: Request): Promise<VendaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.vendasService.listarPorUsuario(usuario);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<VendaEntity> {
    return this.vendasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: any,
  ): Promise<VendaEntity> {
    return this.vendasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.vendasService.remover(id);
  }
}
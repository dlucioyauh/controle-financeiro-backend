import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoGuard } from '../auth/plano.guard';
import type { Request } from 'express';

@Controller('vendas')
@UseGuards(AuthGuard, PlanoGuard)
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  create(@Body() createVendaDto: any, @Req() req: Request) {
    const usuario = (req as any).user?.username;
    // O service tem método 'criar' que aceita Partial<VendaEntity>
    return this.vendasService.criar({ ...createVendaDto, usuario });
  }

  @Get()
  findAll(@Req() req: Request) {
    const usuario = (req as any).user?.username;
    // O service tem método 'listarPorUsuario'
    return this.vendasService.listarPorUsuario(usuario);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // O service tem método 'buscarPorId'
    return this.vendasService.buscarPorId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const usuario = (req as any).user?.username;
    // O service tem método 'remover' (apenas id)
    return this.vendasService.remover(id);
  }
}
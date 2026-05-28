import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ReceitasService } from './receitas.service';
import { ReceitaEntity } from './receita.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('receitas')
@UseGuards(AuthGuard)
export class ReceitasController {
  constructor(private readonly receitasService: ReceitasService) {}

  @Post()
  criar(@Body() data: Partial<ReceitaEntity>, @Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.receitasService.criar({ ...data, usuario });
  }

  @Get()
  listar(@Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.receitasService.listarPorUsuario(usuario);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.receitasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<ReceitaEntity>) {
    return this.receitasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.receitasService.remover(id);
  }
}
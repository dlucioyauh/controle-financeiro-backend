import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('despesas')
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @UseGuards(AuthGuard)
  @Post()
  criar(
    @Body() data: { descricao: string; valor: number; data: string; categoria?: string },
    @Req() req: Request,
  ): Promise<DespesaEntity> {
    const usuario = (req as any).user?.username;
    return this.despesasService.criar({ ...data, usuario });
  }

  @UseGuards(AuthGuard)
  @Get()
  listar(@Req() req: Request): Promise<DespesaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.despesasService.listarPorUsuario(usuario);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<DespesaEntity> {
    return this.despesasService.buscarPorId(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<{ descricao: string; valor: number; data: string; categoria: string }>,
  ): Promise<DespesaEntity> {
    return this.despesasService.atualizar(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.despesasService.remover(id);
  }
}
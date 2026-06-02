import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('despesas')
@UseGuards(AuthGuard)
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  criar(
    @Body() data: { descricao: string; valor: number; data: string; categoria?: string; pessoal?: boolean; tipo?: string },
    @Req() req: Request,
  ): Promise<DespesaEntity> {
    const usuario = (req as any).user?.username;
    return this.despesasService.criar({ ...data, usuario });
  }

  @Get()
  listar(@Req() req: Request): Promise<DespesaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.despesasService.listarPorUsuario(usuario);
  }

  @Get('pessoais')
  listarPessoais(@Req() req: Request): Promise<DespesaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.despesasService.listarPessoais(usuario);
  }

  // NOVO: listar receitas pessoais
  @Get('receitas-pessoais')
  listarReceitasPessoais(@Req() req: Request): Promise<DespesaEntity[]> {
    const usuario = (req as any).user?.username;
    return this.despesasService.listarReceitasPessoais(usuario);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<DespesaEntity> {
    return this.despesasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<{ descricao: string; valor: number; data: string; categoria: string; pessoal: boolean; tipo: string }>,
  ): Promise<DespesaEntity> {
    return this.despesasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.despesasService.remover(id);
  }
}
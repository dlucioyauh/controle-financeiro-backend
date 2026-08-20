import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe, Query,
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';
import { AuthGuard } from '../auth/auth.guard';
import { FilterDespesasDto } from './dto/filter-despesas.dto';
import type { Request } from 'express';

@Controller('despesas')
@UseGuards(AuthGuard)
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  criar(
    @Body() data: any,
    @Req() req: Request,
  ): Promise<DespesaEntity> {
    const user = (req as any).user;
    return this.despesasService.criar({ ...data, userId: user.userId, usuario: user.username });
  }

  @Get()
  listar(@Req() req: Request): Promise<DespesaEntity[]> {
    const user = (req as any).user;
    return this.despesasService.listarPorUsuario(user.userId);
  }

  @Get('pessoais')
  listarPessoais(@Req() req: Request): Promise<DespesaEntity[]> {
    const user = (req as any).user;
    return this.despesasService.listarPessoais(user.userId);
  }

  @Get('receitas-pessoais')
  listarReceitasPessoais(@Req() req: Request): Promise<DespesaEntity[]> {
    const user = (req as any).user;
    return this.despesasService.listarReceitasPessoais(user.userId);
  }

  @Get('totais')
  getTotais(@Req() req: Request, @Query() filter: FilterDespesasDto) {
    const user = (req as any).user;
    return this.despesasService.getTotais(user.userId, filter.pessoal, filter.tipo);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<DespesaEntity> {
    return this.despesasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.despesasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.despesasService.remover(id);
  }
}
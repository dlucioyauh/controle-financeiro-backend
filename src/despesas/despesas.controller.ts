import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe, Query,
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('despesas')
@UseGuards(AuthGuard)
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  criar(@Body() data: Record<string, unknown>, @Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.despesasService.criar({ ...data, userId: customReq.user!.userId } as any);
  }

  // Rota unificada (usada pelo Dashboard)
  @Get()
  listar(
    @Req() req: Request,
    @Query('pessoal') pessoal?: string,
    @Query('tipo') tipo?: string
  ) {
    const customReq = req as RequestWithUser;
    const userId = customReq.user!.userId;
    const isPessoal = pessoal === 'true' ? true : pessoal === 'false' ? false : undefined;
    return this.despesasService.listar(userId, isPessoal, tipo);
  }

  // ✅ ROTA LEGADA RESTAURADA: Para compatibilidade com outras telas do frontend
  @Get('pessoais')
  listarPessoais(@Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.despesasService.listarPessoais(customReq.user!.userId);
  }

  // ✅ ROTA LEGADA RESTAURADA: Para compatibilidade com outras telas do frontend
  @Get('receitas-pessoais')
  listarReceitasPessoais(@Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.despesasService.listarReceitasPessoais(customReq.user!.userId);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.despesasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() data: Record<string, unknown>) {
    return this.despesasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.despesasService.remover(id);
  }
}
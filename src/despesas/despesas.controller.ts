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
    // Injeta o userId no payload, garantindo isolamento por ID (LGPD)
    return this.despesasService.criar({ ...data, userId: customReq.user!.userId } as any);
  }

  @Get()
  listar(
    @Req() req: Request,
    @Query('pessoal') pessoal?: string, // Recebe 'true' ou 'false' como string da URL
    @Query('tipo') tipo?: string
  ) {
    const customReq = req as RequestWithUser;
    const userId = customReq.user!.userId;
    
    // Converte a string do query param para boolean, se existir
    const isPessoal = pessoal === 'true' ? true : pessoal === 'false' ? false : undefined;
    
    // Chama o método unificado com os filtros
    return this.despesasService.listar(userId, isPessoal, tipo);
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
import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
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
    // Injeta o userId no payload, pois o serviço espera apenas 1 argumento (o DTO)
    return this.despesasService.criar({ ...data, userId: customReq.user!.userId } as any);
  }

  @Get()
  listar(@Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.despesasService.listarPorUsuario(customReq.user!.userId);
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
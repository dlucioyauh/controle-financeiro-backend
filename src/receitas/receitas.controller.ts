import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ReceitasService } from './receitas.service';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('receitas')
@UseGuards(AuthGuard)
export class ReceitasController {
  constructor(private readonly receitasService: ReceitasService) {}

  @Post()
  criar(@Body() data: Record<string, unknown>, @Req() req: Request) {
    const customReq = req as RequestWithUser;
    // Injeta o userId no payload, garantindo isolamento e passando na validação do serviço
    return this.receitasService.criar({ ...data, userId: customReq.user!.userId } as any);
  }

  @Get()
  listar(@Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.receitasService.listar(customReq.user!.userId);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.receitasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() data: Record<string, unknown>) {
    return this.receitasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.receitasService.remover(id);
  }
}
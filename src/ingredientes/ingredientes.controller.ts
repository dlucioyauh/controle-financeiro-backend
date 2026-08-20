import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { IngredientesService } from './ingredientes.service';
import { IngredienteEntity } from './ingrediente.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('ingredientes')
@UseGuards(AuthGuard)
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Post()
  criar(@Body() data: Partial<IngredienteEntity>, @Req() req: Request) {
    const user = (req as any).user;
    return this.ingredientesService.criar(data, user.userId, user.username);
  }

  @Get()
  listar(@Req() req: Request) {
    const user = (req as any).user;
    return this.ingredientesService.listarPorUsuario(user.userId);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<IngredienteEntity>) {
    return this.ingredientesService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientesService.remover(id);
  }
}
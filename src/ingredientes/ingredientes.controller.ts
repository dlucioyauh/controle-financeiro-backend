import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { IngredientesService } from './ingredientes.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('ingredientes')
@UseGuards(AuthGuard)
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Post()
  criar(@Body() dadosIngrediente: any, @Req() req: any) {
    const username = req.user.username;
    return this.ingredientesService.criar(dadosIngrediente, username);
  }

  @Get()
  listarTodos(@Req() req: any) {
    const username = req.user.username;
    return this.ingredientesService.listarTodos(username);
  }

  @Delete(':id')
  remover(@Param('id') id: string, @Req() req: any) {
    const username = req.user.username;
    return this.ingredientesService.remover(id, username);
  }
}
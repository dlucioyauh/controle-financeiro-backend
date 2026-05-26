import {
  Controller, Get, Post, Patch, Delete, Param, Body, ParseUUIDPipe,
} from '@nestjs/common';
import { IngredientesService } from './ingredientes.service';
import { IngredienteEntity } from './ingrediente.entity';

@Controller('ingredientes')
export class IngredientesController {
  constructor(private readonly ingredientesService: IngredientesService) {}

  @Post()
  criar(@Body() data: Partial<IngredienteEntity>): Promise<IngredienteEntity> {
    return this.ingredientesService.criar(data);
  }

  @Get()
  listar(): Promise<IngredienteEntity[]> {
    return this.ingredientesService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<IngredienteEntity> {
    return this.ingredientesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<IngredienteEntity>,
  ): Promise<IngredienteEntity> {
    return this.ingredientesService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ingredientesService.remover(id);
  }
}
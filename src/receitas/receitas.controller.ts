import {
  Controller, Get, Post, Patch, Delete, Param, Body, ParseUUIDPipe,
} from '@nestjs/common';
import { ReceitasService } from './receitas.service';
import { ReceitaEntity } from './receita.entity';

@Controller('receitas')
export class ReceitasController {
  constructor(private readonly receitasService: ReceitasService) {}

  @Post()
  criar(@Body() data: Partial<ReceitaEntity>): Promise<ReceitaEntity> {
    return this.receitasService.criar(data);
  }

  @Get()
  listar(): Promise<ReceitaEntity[]> {
    return this.receitasService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<ReceitaEntity> {
    return this.receitasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<ReceitaEntity>,
  ): Promise<ReceitaEntity> {
    return this.receitasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.receitasService.remover(id);
  }
}
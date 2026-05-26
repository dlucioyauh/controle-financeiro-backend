import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';

@Controller('despesas')
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  criar(
    @Body() data: { descricao: string; valor: number; data: string; categoria?: string },
  ): Promise<DespesaEntity> {
    return this.despesasService.criar(data);
  }

  @Get()
  listar(): Promise<DespesaEntity[]> {
    return this.despesasService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<DespesaEntity> {
    return this.despesasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<{ descricao: string; valor: number; data: string; categoria: string }>,
  ): Promise<DespesaEntity> {
    return this.despesasService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.despesasService.remover(id);
  }
}
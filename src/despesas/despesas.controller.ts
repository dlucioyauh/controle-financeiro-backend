import { Controller, Get, Post, Body } from '@nestjs/common';
import { DespesasService } from './despesas.service';

@Controller('despesas')
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  create(@Body() body: any) {
    return this.despesasService.create(body);
  }

  @Get()
  findAll() {
    return this.despesasService.findAll();
  }
}
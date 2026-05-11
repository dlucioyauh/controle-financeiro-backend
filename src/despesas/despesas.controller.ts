import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.despesasService.remove(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dados: any,
  ) {
    return this.despesasService.update(Number(id), dados);
  }
}
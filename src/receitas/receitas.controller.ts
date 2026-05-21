import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { ReceitasService } from './receitas.service';

@Controller('receitas')
export class ReceitasController {
  constructor(
    private readonly service: ReceitasService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
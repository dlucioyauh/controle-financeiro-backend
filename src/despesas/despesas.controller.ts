import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DespesasService } from './despesas.service';

@UseGuards(AuthGuard)
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
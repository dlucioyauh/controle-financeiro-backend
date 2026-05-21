import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { IngredientesService } from './ingredientes.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('ingredientes')
export class IngredientesController {
  constructor(
    private readonly service: IngredientesService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: any) {
    // Mapeia campos do frontend para o banco
    const payload = {
      ...body,
      preco: body.preco ?? body.precoCompra,
      unidade: body.unidade ?? body.unidadeMedida,
      precoCompra: body.precoCompra ?? body.preco,
      unidadeMedida: body.unidadeMedida ?? body.unidade,
    };
    return this.service.create(payload);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const payload = {
      ...body,
      preco: body.preco ?? body.precoCompra,
      unidade: body.unidade ?? body.unidadeMedida,
      precoCompra: body.precoCompra ?? body.preco,
      unidadeMedida: body.unidadeMedida ?? body.unidade,
    };
    return this.service.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
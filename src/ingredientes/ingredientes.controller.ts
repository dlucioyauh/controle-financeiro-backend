import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IngredientesService } from './ingredientes.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('ingredientes')
export class IngredientesController {
  constructor(private readonly service: IngredientesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.username);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    const payload = {
      ...body,
      preco: body.preco ?? body.precoCompra,
      unidade: body.unidade ?? body.unidadeMedida,
      precoCompra: body.precoCompra ?? body.preco,
      unidadeMedida: body.unidadeMedida ?? body.unidade,
    };
    return this.service.create(payload, req.user.username);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const payload = {
      ...body,
      preco: body.preco ?? body.precoCompra,
      unidade: body.unidade ?? body.unidadeMedida,
      precoCompra: body.precoCompra ?? body.preco,
      unidadeMedida: body.unidadeMedida ?? body.unidade,
    };
    return this.service.update(id, payload, req.user.username);
  }

  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const payload = {
      ...body,
      preco: body.preco ?? body.precoCompra,
      unidade: body.unidade ?? body.unidadeMedida,
      precoCompra: body.precoCompra ?? body.preco,
      unidadeMedida: body.unidadeMedida ?? body.unidade,
    };
    return this.service.update(id, payload, req.user.username);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user.username);
  }
}
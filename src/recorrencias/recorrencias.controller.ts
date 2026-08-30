import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { RecorrenciasService } from './recorrencias.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('recorrencias')
@UseGuards(AuthGuard)
export class RecorrenciasController {
  constructor(private readonly recorrenciasService: RecorrenciasService) {}

  @Post()
  criar(@Req() req: any, @Body() body: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.recorrenciasService.criar(userId, body);
  }

  @Get()
  listar(@Req() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.recorrenciasService.listarPorUsuario(userId);
  }

  @Patch(':id/cancelar')
  cancelar(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.sub;
    return this.recorrenciasService.cancelar(id, userId);
  }
}
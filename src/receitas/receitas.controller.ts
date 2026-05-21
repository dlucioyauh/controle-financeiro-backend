import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReceitasService } from './receitas.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('receitas')
@UseGuards(AuthGuard)
export class ReceitasController {
  constructor(private readonly receitasService: ReceitasService) {}

  @Post()
  criar(@Body() dadosReceita: any, @Req() req: any) {
    const username = req.user.username;
    return this.receitasService.criar(dadosReceita, username);
  }

  @Get()
  listarTodas(@Req() req: any) {
    const username = req.user.username;
    return this.receitasService.listarTodas(username);
  }

  @Delete(':id')
  remover(@Param('id') id: string, @Req() req: any) {
    const username = req.user.username;
    return this.receitasService.remover(id, username);
  }
}
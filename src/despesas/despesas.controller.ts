import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

@Controller('despesas')
@UseGuards(AuthGuard)
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  async criar(@Body() data: any, @Req() req: CustomRequest) {
    return this.despesasService.criar({ ...data, userId: req.user!.userId });
  }

  @Get()
  async listar(
    @Req() req: CustomRequest,
    @Query('pessoal') pessoal?: string,
    @Query('tipo') tipo?: string,
  ) {
    const userId = req.user!.userId;
    // ✅ Converte a string 'true'/'false' da query para boolean, com fallback para false
    const isPessoal = pessoal === 'true';
    
    return this.despesasService.listar(userId, isPessoal, tipo);
  }

  @Get('pessoais')
  async listarPessoais(@Req() req: CustomRequest) {
    return this.despesasService.listarPessoais(req.user!.userId);
  }

  @Get('receitas-pessoais')
  async listarReceitasPessoais(@Req() req: CustomRequest) {
    return this.despesasService.listarReceitasPessoais(req.user!.userId);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.despesasService.buscarPorId(id);
  }

  @Patch(':id')
  async atualizar(@Param('id') id: string, @Body() data: any) {
    return this.despesasService.atualizar(id, data);
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    return this.despesasService.remover(id);
  }
}
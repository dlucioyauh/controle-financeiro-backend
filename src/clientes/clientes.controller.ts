import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Customer } from './customer.entity';
import { AuthGuard } from '../auth/auth.guard';
import { LimiteClientesGuard } from './limite-clientes.guard';
import type { Request } from 'express';

@Controller('clientes')
@UseGuards(AuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @UseGuards(LimiteClientesGuard)
  @Post()
  criar(@Body() data: any, @Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.clientesService.criar({ ...data, usuario });
  }

  @Get()
  async listar(@Req() req: Request) {
    try {
      const usuario = (req as any).user?.username;
      console.log('📋 Listar clientes - usuário:', usuario);
      const result = await this.clientesService.listarPorUsuario(usuario);
      console.log('✅ Clientes encontrados:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Erro no controller listar:', error);
      throw error;
    }
  }

  @Get('mapa')
  listarParaMapa(@Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.clientesService.listarParaMapa(usuario);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.clientesService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.remover(id);
  }
}
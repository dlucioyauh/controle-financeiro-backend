import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Customer } from './customer.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('clientes')
@UseGuards(AuthGuard) // protege todas as rotas
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  criar(@Body() data: any, @Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.clientesService.criar({ ...data, usuario });
  }

  @Get()
  listar(@Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.clientesService.listarPorUsuario(usuario);
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
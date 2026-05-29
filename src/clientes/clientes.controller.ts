import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Customer } from './customer.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('clientes')
@UseGuards(AuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  criar(@Body() data: Partial<Customer>, @Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.clientesService.criar({ ...data, usuario });
  }

  @Get()
  listar(@Req() req: Request) {
    const usuario = (req as any).user?.username;
    return this.clientesService.listarPorUsuario(usuario);
  }

  // NOVA ROTA PARA O MAPA
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
  atualizar(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<Customer>) {
    return this.clientesService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.remover(id);
  }
}

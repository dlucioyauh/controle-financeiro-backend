import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Customer } from './customer.entity';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import { LimiteClientesGuard } from './limite-clientes.guard';
import type { Request } from 'express';

@Controller('clientes')
@UseGuards(AuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @UseGuards(LimiteClientesGuard)
  @Post()
  criar(@Body() data: Partial<Customer>, @Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.clientesService.criar(data, customReq.user!.userId, customReq.user!.username);
  }

  @Get()
  listar(@Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.clientesService.listarPorUsuario(customReq.user!.userId);
  }

  @Get('mapa')
  listarParaMapa(@Req() req: Request) {
    const customReq = req as RequestWithUser;
    return this.clientesService.listarParaMapa(customReq.user!.userId);
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
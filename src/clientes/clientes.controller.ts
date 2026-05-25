import {
  Controller, Get, Post, Patch, Delete, Param, Body, ParseUUIDPipe,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Customer } from './customer.entity';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  criar(@Body() data: { nome: string; email?: string; telefone?: string; endereco?: string }): Promise<Customer> {
    return this.clientesService.criar(data);
  }

  @Get()
  listar(): Promise<Customer[]> {
    return this.clientesService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    return this.clientesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<{ nome: string; email: string; telefone: string; endereco: string }>,
  ): Promise<Customer> {
    return this.clientesService.atualizar(id, data);
  }

  @Delete(':id')
  remover(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.clientesService.remover(id);
  }
}
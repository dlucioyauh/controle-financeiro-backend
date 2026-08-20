import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Customer } from './customer.entity';
import { UsersService } from '../users/users.service'; // ← importar

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Customer)
    private clientesRepository: Repository<Customer>,
    private usersService: UsersService, // ← injetar
  ) {}

  async criar(data: Partial<Customer>, userId: string, username: string): Promise<Customer> {
    const cliente = this.clientesRepository.create({
      ...data,
      userId,
      usuario: username,
    });
    return this.clientesRepository.save(cliente);
  }

  async listarPorUsuario(userId: string): Promise<Customer[]> {
    // Busca por userId
    let clientes = await this.clientesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Fallback: busca por username
    if (clientes.length === 0) {
      const user = await this.usersService.findById(userId);
      if (user) {
        clientes = await this.clientesRepository.find({
          where: { usuario: user.username },
          order: { createdAt: 'DESC' },
        });
      }
    }

    return clientes;
  }

  async listarParaMapa(userId: string): Promise<Customer[]> {
    let clientes = await this.clientesRepository.find({
      where: { userId, latitude: Not(IsNull()) },
    });

    if (clientes.length === 0) {
      const user = await this.usersService.findById(userId);
      if (user) {
        clientes = await this.clientesRepository.find({
          where: { usuario: user.username, latitude: Not(IsNull()) },
        });
      }
    }

    return clientes;
  }

  async buscarPorId(id: string): Promise<Customer> {
    const cliente = await this.clientesRepository.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    return cliente;
  }

  async atualizar(id: string, data: Partial<Customer>): Promise<Customer> {
    const cliente = await this.buscarPorId(id);
    Object.assign(cliente, data);
    return this.clientesRepository.save(cliente);
  }

  async remover(id: string): Promise<void> {
    const result = await this.clientesRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
  }
}
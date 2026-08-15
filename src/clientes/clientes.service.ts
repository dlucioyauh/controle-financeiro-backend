import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Customer)
    private clientesRepository: Repository<Customer>,
  ) {}

  async criar(data: Partial<Customer>): Promise<Customer> {
    const cliente = this.clientesRepository.create(data);
    return this.clientesRepository.save(cliente);
  }

  async listarPorUsuario(usuario: string): Promise<Customer[]> {
    try {
      console.log('🔍 Buscando clientes para usuário:', usuario);
      const result = await this.clientesRepository.find({
        where: { usuario },
        order: { createdAt: 'DESC' },
      });
      console.log('📦 Resultado da query:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro no service listarPorUsuario:', error);
      throw error;
    }
  }

  // Método corrigido para o mapa (filtra clientes com latitude não nula)
  async listarParaMapa(usuario: string): Promise<Customer[]> {
    return this.clientesRepository.find({
      where: {
        usuario,
        latitude: Not(IsNull()), // ← CORREÇÃO: usa operadores do TypeORM em vez de { $ne: null }
      },
    });
  }

  async buscarPorId(id: string): Promise<Customer> {
    const cliente = await this.clientesRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async atualizar(id: string, data: Partial<Customer>): Promise<Customer> {
    const cliente = await this.buscarPorId(id);
    Object.assign(cliente, data);
    return this.clientesRepository.save(cliente);
  }

  async remover(id: string): Promise<void> {
    const result = await this.clientesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }
}
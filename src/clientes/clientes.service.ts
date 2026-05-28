import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async criar(data: {
    nome: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    usuario?: string;            // ← NOVO CAMPO
  }): Promise<Customer> {
    const customer = this.customerRepository.create(data);
    return this.customerRepository.save(customer);
  }

  // Método original (sem filtro) – mantenha para compatibilidade interna, se necessário
  async listar(): Promise<Customer[]> {
    return this.customerRepository.find({ order: { nome: 'ASC' } });
  }

  // NOVO MÉTODO: filtra por usuário
  async listarPorUsuario(usuario: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { usuario },
      order: { nome: 'ASC' },
    });
  }

  async buscarPorId(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return customer;
  }

  async atualizar(
    id: string,
    data: Partial<{ nome: string; email: string; telefone: string; endereco: string }>,
  ): Promise<Customer> {
    const customer = await this.buscarPorId(id);
    Object.assign(customer, data);
    return this.customerRepository.save(customer);
  }

  async remover(id: string): Promise<void> {
    const resultado = await this.customerRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }
}
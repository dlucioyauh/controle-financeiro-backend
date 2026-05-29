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
  async criar(data: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(data);
    return this.customerRepository.save(customer);
  }
  async listar(): Promise<Customer[]> {
    return this.customerRepository.find({ order: { nome: 'ASC' } });
  }
  async listarPorUsuario(usuario: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { usuario },
      order: { nome: 'ASC' },
    });
  }
  async listarParaMapa(usuario: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { usuario },
      select: ['id', 'nome', 'latitude', 'longitude', 'endereco', 'bairro', 'cidade'],
      order: { nome: 'ASC' },
    });
  }
  async buscarPorId(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    return customer;
  }
  async atualizar(id: string, data: Partial<Customer>): Promise<Customer> {
    const customer = await this.buscarPorId(id);
    Object.assign(customer, data);
    return this.customerRepository.save(customer);
  }
  async remover(id: string): Promise<void> {
    const resultado = await this.customerRepository.delete(id);
    if (resultado.affected === 0) throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
  }
}

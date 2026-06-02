import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DespesaEntity } from './despesa.entity';

@Injectable()
export class DespesasService {
  constructor(
    @InjectRepository(DespesaEntity)
    private despesaRepository: Repository<DespesaEntity>,
  ) {}

  async criar(data: {
    descricao: string;
    valor: number;
    data: string;
    categoria?: string;
    usuario?: string;
    pessoal?: boolean;
    tipo?: string;   // ← novo campo
  }): Promise<DespesaEntity> {
    const despesa = this.despesaRepository.create(data);
    return this.despesaRepository.save(despesa);
  }

  // Empresariais (apenas despesas)
  async listarPorUsuario(usuario: string): Promise<DespesaEntity[]> {
    return this.despesaRepository.find({
      where: { usuario, pessoal: false, tipo: 'despesa' },
      order: { data: 'DESC' },
    });
  }

  // Pessoais (despesas)
  async listarPessoais(usuario: string): Promise<DespesaEntity[]> {
    return this.despesaRepository.find({
      where: { usuario, pessoal: true, tipo: 'despesa' },
      order: { data: 'DESC' },
    });
  }

  // Receitas pessoais (entradas)
  async listarReceitasPessoais(usuario: string): Promise<DespesaEntity[]> {
    return this.despesaRepository.find({
      where: { usuario, pessoal: true, tipo: 'receita' },
      order: { data: 'DESC' },
    });
  }

  // Todas as pessoais (despesas + receitas) para cálculos
  async listarTodasPessoais(usuario: string): Promise<DespesaEntity[]> {
    return this.despesaRepository.find({
      where: { usuario, pessoal: true },
      order: { data: 'DESC' },
    });
  }

  async buscarPorId(id: string): Promise<DespesaEntity> {
    const despesa = await this.despesaRepository.findOne({ where: { id } });
    if (!despesa) throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    return despesa;
  }

  async atualizar(
    id: string,
    data: Partial<{
      descricao: string;
      valor: number;
      data: string;
      categoria: string;
      pessoal: boolean;
      tipo: string;
    }>,
  ): Promise<DespesaEntity> {
    const despesa = await this.buscarPorId(id);
    Object.assign(despesa, data);
    return this.despesaRepository.save(despesa);
  }

  async remover(id: string): Promise<void> {
    const resultado = await this.despesaRepository.delete(id);
    if (resultado.affected === 0) throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
  }
}
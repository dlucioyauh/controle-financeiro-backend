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
    userId: string; // ✅ Padronizado para userId (LGPD)
    pessoal?: boolean;
    tipo?: string;
  }): Promise<DespesaEntity> {
    const despesa = this.despesaRepository.create(data);
    return this.despesaRepository.save(despesa);
  }

  // ✅ Método unificado e flexível para listagem com filtros opcionais
  async listar(userId: string, pessoal?: boolean, tipo?: string): Promise<DespesaEntity[]> {
    const where: any = { userId };
    
    if (pessoal !== undefined) {
      where.pessoal = pessoal;
    }
    if (tipo) {
      where.tipo = tipo;
    }

    return this.despesaRepository.find({
      where,
      order: { data: 'DESC' },
    });
  }

  // Métodos legados mantidos para compatibilidade, mas agora usam o método unificado
  async listarPorUsuario(userId: string): Promise<DespesaEntity[]> {
    return this.listar(userId, false, 'despesa');
  }

  async listarPessoais(userId: string): Promise<DespesaEntity[]> {
    return this.listar(userId, true, 'despesa');
  }

  async listarReceitasPessoais(userId: string): Promise<DespesaEntity[]> {
    return this.listar(userId, true, 'receita');
  }

  async listarTodasPessoais(userId: string): Promise<DespesaEntity[]> {
    return this.listar(userId, true);
  }

  async buscarPorId(id: string): Promise<DespesaEntity> {
    const despesa = await this.despesaRepository.findOne({ where: { id } });
    if (!despesa) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    }
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
    if (resultado.affected === 0) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
    }
  }

  async getTotais(userId: string, pessoal: boolean = false, tipo?: 'despesa' | 'receita'): Promise<{ total: number; quantidade: number }> {
    const where: any = { userId };
    if (pessoal !== undefined) where.pessoal = pessoal;
    if (tipo) where.tipo = tipo;

    const registros = await this.despesaRepository.find({ where });
    const total = registros.reduce((sum, r) => sum + Number(r.valor), 0);
    return { total, quantidade: registros.length };
  }
}
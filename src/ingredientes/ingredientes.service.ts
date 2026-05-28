import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredienteEntity } from './ingrediente.entity';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(IngredienteEntity)
    private ingredienteRepository: Repository<IngredienteEntity>,
  ) {}

  async criar(data: Partial<IngredienteEntity>): Promise<IngredienteEntity> {
    const ingrediente = this.ingredienteRepository.create(data);
    return this.ingredienteRepository.save(ingrediente);
  }

  async listarPorUsuario(usuario: string): Promise<IngredienteEntity[]> {
    return this.ingredienteRepository.find({
      where: { usuario },
      order: { nome: 'ASC' },
    });
  }

  async buscarPorId(id: string): Promise<IngredienteEntity> {
    const ingrediente = await this.ingredienteRepository.findOne({ where: { id } });
    if (!ingrediente) {
      throw new NotFoundException(`Ingrediente com ID ${id} não encontrado`);
    }
    return ingrediente;
  }

  async atualizar(id: string, data: Partial<IngredienteEntity>): Promise<IngredienteEntity> {
    const ingrediente = await this.buscarPorId(id);
    Object.assign(ingrediente, data);
    return this.ingredienteRepository.save(ingrediente);
  }

  async remover(id: string): Promise<void> {
    const resultado = await this.ingredienteRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Ingrediente com ID ${id} não encontrado`);
    }
  }
}
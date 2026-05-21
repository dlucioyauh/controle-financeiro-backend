import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredienteEntity } from './ingrediente.entity.js';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(IngredienteEntity)
    private repo: Repository<IngredienteEntity>,
  ) {}

  async criar(dadosIngrediente: Partial<IngredienteEntity>, username: string): Promise<IngredienteEntity> {
    // Salva vinculando diretamente ao usuário ativo
    const novoIngrediente = this.repo.create({ ...dadosIngrediente, usuario: username });
    return this.repo.save(novoIngrediente);
  }

  async listarTodos(username: string): Promise<IngredienteEntity[]> {
    // Retorna exclusivamente os insumos do usuário logado
    return this.repo.find({
      where: { usuario: username },
      order: { nome: 'ASC' },
    });
  }

  async remover(id: string, username: string) {
    const ingrediente = await this.repo.findOneBy({ id });

    if (ingrediente && ingrediente.usuario !== username) {
      throw new UnauthorizedException('Você não tem permissão para remover este ingrediente.');
    }

    return this.repo.delete(id);
  }
}
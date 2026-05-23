import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from './cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteEntity)
    private repo: Repository<ClienteEntity>,
  ) {}

  findAll(usuario: string) {
    return this.repo.find({ where: { usuario }, order: { nome: 'ASC' } });
  }

  create(data: Partial<ClienteEntity>, usuario: string) {
    return this.repo.save({ ...data, usuario });
  }

  async update(id: string, data: Partial<ClienteEntity>, usuario: string) {
    await this.repo.update({ id, usuario }, data);
    return this.repo.findOneBy({ id });
  }

  remove(id: string, usuario: string) {
    return this.repo.delete({ id, usuario });
  }
}

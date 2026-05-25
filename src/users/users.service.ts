import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: {
    username: string;
    password: string;
    nome?: string;
    email?: string;
    nomeNegocio?: string;
    telefone?: string;
  }) {
    const usuarioExiste =
      await this.usersRepository.findOne({
        where: [
          { username: data.username },
          ...(data.email
            ? [{ email: data.email }]
            : []),
        ],
      });

    if (usuarioExiste) {
      throw new ConflictException(
        'Usuário ou email já cadastrado',
      );
    }

    const senhaHash = await bcrypt.hash(
      data.password,
      10,
    );

    const novoUsuario =
      this.usersRepository.create({
        username: data.username,
        password: senhaHash,
        nome: data.nome || null,
        email: data.email || null,
        nomeNegocio:
          data.nomeNegocio || null,
        telefone: data.telefone || null,
      });

    return this.usersRepository.save(
      novoUsuario,
    );
  }

  async findOne(username: string) {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async listarUsuarios() {
    return this.usersRepository.find({
      select: {
        id: true,
        username: true,
        nome: true,
        createdAt: true,
      },
    });
  }

  async deletarUsuario(id: string) {
    return this.usersRepository.delete(id);
  }
}
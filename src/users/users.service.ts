import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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

  async findOne(username: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(username: string, password: string): Promise<UserEntity> {
    const exists = await this.findOne(username);
    if (exists) throw new ConflictException('Usuário já existe');
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashed });
    return this.usersRepository.save(user);
  }

  async alterarSenha(username: string, senhaAtual: string, novaSenha: string): Promise<void> {
    const user = await this.findOne(username);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    const senhaCorreta = await bcrypt.compare(senhaAtual, user.password);
    if (!senhaCorreta) throw new UnauthorizedException('Senha atual incorreta');
    user.password = await bcrypt.hash(novaSenha, 10);
    await this.usersRepository.save(user);
  }

  async atualizarPerfil(username: string, data: { nomeNegocio?: string }): Promise<UserEntity> {
    const user = await this.findOne(username);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    if (data.nomeNegocio !== undefined) user.nomeNegocio = data.nomeNegocio;
    return this.usersRepository.save(user);
  }

  async getPerfil(username: string): Promise<{ username: string; nomeNegocio: string | null; createdAt: Date }> {
    const user = await this.findOne(username);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return {
      username: user.username,
      nomeNegocio: user.nomeNegocio,
      createdAt: user.createdAt,
    };
  }
}
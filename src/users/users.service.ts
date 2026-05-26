import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
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
    const usuarioExiste = await this.usersRepository.findOne({
      where: [
        { username: data.username },
        ...(data.email ? [{ email: data.email }] : []),
      ],
    });
    if (usuarioExiste) {
      throw new ConflictException('Usuário ou email já cadastrado');
    }
    const senhaHash = await bcrypt.hash(data.password, 10);
    const novoUsuario = this.usersRepository.create({
      username: data.username,
      password: senhaHash,
      nome: data.nome || null,
      email: data.email || null,
      nomeNegocio: data.nomeNegocio || null,
      telefone: data.telefone || null,
    });
    return this.usersRepository.save(novoUsuario);
  }

  async findOne(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async listarUsuarios() {
    return this.usersRepository.find({
      select: { id: true, username: true, nome: true, createdAt: true },
    });
  }

  async deletarUsuario(id: string) {
    return this.usersRepository.delete(id);
  }

  // ── NOVAS FUNÇÕES ──────────────────────────────────────────

  async getPerfil(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { password, ...perfil } = user;
    return perfil;
  }

  async updatePerfil(
    userId: string,
    dados: {
      nome?: string;
      email?: string;
      nomeNegocio?: string;
      telefone?: string;
    },
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.usersRepository.update({ id: userId }, dados);
    return this.getPerfil(userId);
  }

  async alterarSenha(
    userId: string,
    senhaAtual: string,
    novaSenha: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const senhaCorreta = await bcrypt.compare(senhaAtual, user.password);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const novaHash = await bcrypt.hash(novaSenha, 10);
    await this.usersRepository.update({ id: userId }, { password: novaHash });
    return { message: 'Senha alterada com sucesso' };
  }
}
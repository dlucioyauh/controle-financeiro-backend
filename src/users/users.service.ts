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

  async getPerfil(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new ConflictException('Usuário não encontrado');
    const { password, ...rest } = user;
    return rest;
  }

  async updatePerfil(
    userId: string,
    data: {
      nome?: string;
      email?: string;
      nomeNegocio?: string;
      telefone?: string;
    },
  ) {
    const user = await this.findById(userId);
    if (!user) throw new ConflictException('Usuário não encontrado');
    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  async alterarSenha(
    userId: string,
    senhaAtual: string,
    novaSenha: string,
  ) {
    const user = await this.findById(userId);
    if (!user) throw new ConflictException('Usuário não encontrado');
    const valida = await bcrypt.compare(senhaAtual, user.password);
    if (!valida) throw new ConflictException('Senha atual incorreta');
    user.password = await bcrypt.hash(novaSenha, 10);
    await this.usersRepository.save(user);
    return { message: 'Senha alterada com sucesso' };
  }

  // ADMIN: listagem com estatísticas agregadas
  async listarUsuarios() {
    const usuarios = await this.usersRepository.find({
      select: ['id', 'username', 'nome', 'email', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    const resultado = await Promise.all(
      usuarios.map(async (user) => {
        const [vendas, despesas, clientes, receitas, ingredientes] =
          await Promise.all([
            this.usersRepository.manager.query(
              `SELECT COUNT(*) FROM vendas WHERE usuario = $1`,
              [user.username],
            ),
            this.usersRepository.manager.query(
              `SELECT COUNT(*) FROM despesa WHERE usuario = $1`,
              [user.username],
            ),
            this.usersRepository.manager.query(
              `SELECT COUNT(*) FROM clientes WHERE usuario = $1`,
              [user.username],
            ),
            this.usersRepository.manager.query(
              `SELECT COUNT(*) FROM receitas WHERE usuario = $1`,
              [user.username],
            ),
            this.usersRepository.manager.query(
              `SELECT COUNT(*) FROM ingredientes WHERE usuario = $1`,
              [user.username],
            ),
          ]);

        return {
          ...user,
          totalVendas: parseInt(vendas[0]?.count || '0'),
          totalDespesas: parseInt(despesas[0]?.count || '0'),
          totalClientes: parseInt(clientes[0]?.count || '0'),
          totalReceitas: parseInt(receitas[0]?.count || '0'),
          totalIngredientes: parseInt(ingredientes[0]?.count || '0'),
        };
      }),
    );

    return resultado;
  }

  async deletarUsuario(id: string) {
    return this.usersRepository.delete(id);
  }
}
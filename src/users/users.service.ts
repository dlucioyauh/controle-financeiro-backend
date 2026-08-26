import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserPreferences } from './user-preferences.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(UserPreferences)
    private preferencesRepository: Repository<UserPreferences>,
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
      onboardingSteps: {},
    });

    const savedUser = await this.usersRepository.save(novoUsuario);

    const prefs = this.preferencesRepository.create({ userId: savedUser.id });
    await this.preferencesRepository.save(prefs);

    return savedUser;
  }

  async findOne(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByStripeCustomerId(customerId: string) {
    return this.usersRepository.findOne({
      where: { stripeCustomerId: customerId },
    });
  }

  // ✅ NOVO: Buscar por e-mail
  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  // ✅ NOVO: Buscar por token de recuperação
  async findByResetToken(token: string) {
    return this.usersRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async getPerfil(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { password, resetPasswordToken, resetPasswordExpires, ...rest } = user;
    return rest;
  }

  async updatePerfil(
    userId: string,
    data: Partial<UserEntity>,
    currentUsername?: string,
  ) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (currentUsername !== 'dlucio' && currentUsername !== 'admin') {
      delete data.plano;
    }

    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  async alterarSenha(
    userId: string,
    senhaAtual: string,
    novaSenha: string,
  ) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const valida = await bcrypt.compare(senhaAtual, user.password);
    if (!valida) throw new ConflictException('Senha atual incorreta');
    user.password = await bcrypt.hash(novaSenha, 10);
    await this.usersRepository.save(user);
    return { message: 'Senha alterada com sucesso' };
  }

  async updateOnboardingStatus(userId: string, step: string, completed: boolean) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const currentSteps = user.onboardingSteps || {};
    currentSteps[step] = completed;

    await this.usersRepository.update(userId, { onboardingSteps: currentSteps });
    return { message: 'Status atualizado', steps: currentSteps };
  }

  async listarUsuarios() {
    const usuarios = await this.usersRepository.find({
      select: ['id', 'username', 'nome', 'email', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    const resultado = await Promise.all(
      usuarios.map(async (user) => {
        const [vendas, despesas, clientes, receitas, ingredientes] =
          await Promise.all([
            this.usersRepository.manager.query(`SELECT COUNT(*) FROM vendas WHERE "userId" = $1`, [user.id]),
            this.usersRepository.manager.query(`SELECT COUNT(*) FROM despesa WHERE "userId" = $1`, [user.id]),
            this.usersRepository.manager.query(`SELECT COUNT(*) FROM clientes WHERE "userId" = $1`, [user.id]),
            this.usersRepository.manager.query(`SELECT COUNT(*) FROM receitas WHERE "userId" = $1`, [user.id]),
            this.usersRepository.manager.query(`SELECT COUNT(*) FROM ingredientes WHERE "userId" = $1`, [user.id]),
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
    await this.usersRepository.manager.query(`DELETE FROM vendas WHERE "userId" = $1`, [id]);
    await this.usersRepository.manager.query(`DELETE FROM clientes WHERE "userId" = $1`, [id]);
    await this.usersRepository.manager.query(`DELETE FROM despesa WHERE "userId" = $1`, [id]);
    await this.usersRepository.manager.query(`DELETE FROM receitas WHERE "userId" = $1`, [id]);
    await this.usersRepository.manager.query(`DELETE FROM ingredientes WHERE "userId" = $1`, [id]);
    await this.usersRepository.manager.query(`DELETE FROM user_preferences WHERE "userId" = $1`, [id]);

    return this.usersRepository.delete(id);
  }

  async updateByStripeCustomer(customerId: string, data: Partial<UserEntity>) {
    await this.usersRepository.update(
      { stripeCustomerId: customerId },
      data as any,
    );
  }
}
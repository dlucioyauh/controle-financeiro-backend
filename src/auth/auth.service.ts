import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);

    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(data: {
    username: string;
    password: string;
    nome?: string;
    email?: string;
    nomeNegocio?: string;
    telefone?: string;
  }) {
    const user = await this.usersService.create(data);

    if (!user.plano || user.plano === 'free') {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);
      await this.usersService.updatePerfil(user.id, { trialEndsAt: trialEnd } as any);
    }

    if (user.email) {
      try {
        await this.mailService.sendWelcomeEmail(user.email, user.nome || user.username);
      } catch (error) {
        console.warn('Não foi possível enviar boas‑vindas ao usuário:', (error as any).message);
      }
    }

    try {
      const assunto = `Novo cadastro: ${user.username} (${user.email || 'sem e‑mail'})`;
      await this.mailService.sendWelcomeEmail('dlucio.douglas@gmail.com', assunto);
    } catch (error) {
      console.warn('Não foi possível notificar o dono:', (error as any).message);
    }

    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.sign(payload) };
  }

  // ✅ NOVO: Solicitar recuperação de senha
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    const successMessage = { message: 'Se este e-mail estiver cadastrado, você receberá um link de recuperação.' };
    
    if (!user || !user.email) {
      return successMessage;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await this.usersService.updatePerfil(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    } as any);

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/resetar-senha?token=${token}`;

    try {
      await this.mailService.sendPasswordReset(user.email, user.nome || user.username, resetUrl);
    } catch (error) {
      console.warn('Erro ao enviar e-mail de recuperação:', (error as any).message);
    }

    return successMessage;
  }

  // ✅ NOVO: Redefinir senha com o token
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user || !user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Token inválido ou expirado. Solicite um novo link.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePerfil(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    } as any);

    return { message: 'Senha redefinida com sucesso. Faça login com sua nova senha.' };
  }
}
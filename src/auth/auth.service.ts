import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaCorreta = await bcrypt.compare(
      password,
      user.password,
    );

    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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

    // Tentar enviar e‑mail, mas não falhar se der erro
    if (user.email) {
      try {
        await this.mailService.sendWelcomeEmail(user.email, user.nome || user.username);
      } catch (error) {
        console.warn('Não foi possível enviar o e‑mail de boas‑vindas:', (error as any).message);
      }
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
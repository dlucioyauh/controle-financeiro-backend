import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { SetMetadata } from '@nestjs/common';

export const PLANO_MINIMO = 'plano_minimo';
export const RequerPlano = (plano: string) => SetMetadata(PLANO_MINIMO, plano);

@Injectable()
export class PlanoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const planoMinimo = this.reflector.get<string>(PLANO_MINIMO, context.getHandler());
    if (!planoMinimo) return true; // sem decorator = acesso livre

    const request = context.switchToHttp().getRequest();
    const username = request.user?.username;
    if (!username) throw new ForbiddenException('Usuário não autenticado');

    const user = await this.usersService.findOne(username);
    if (!user) throw new ForbiddenException('Usuário não encontrado');

    // Determina o nível de acesso efetivo
    const hierarquia = ['free', 'basic', 'pro', 'premium'];
    let nivelEfetivo = hierarquia.indexOf(user.plano || 'free');

    // Se o plano for 'free' mas ainda estiver dentro do trial, trata como 'pro'
    if (user.plano === 'free' && user.trialEndsAt) {
      const agora = new Date();
      if (agora <= new Date(user.trialEndsAt)) {
        nivelEfetivo = hierarquia.indexOf('pro'); // acesso Pro durante o trial
      }
    }

    const nivelExigido = hierarquia.indexOf(planoMinimo);

    if (nivelEfetivo < nivelExigido) {
      throw new ForbiddenException(
        `Seu plano (${user.plano}) não permite esta funcionalidade. Faça upgrade para ${planoMinimo} ou superior.`,
      );
    }

    return true;
  }
}
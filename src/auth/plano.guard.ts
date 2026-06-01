import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

// Decorator para indicar qual plano mínimo é exigido
export const PLANO_MINIMO = 'plano_minimo';
import { SetMetadata } from '@nestjs/common';
export const RequerPlano = (plano: string) => SetMetadata(PLANO_MINIMO, plano);

@Injectable()
export class PlanoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const planoMinimo = this.reflector.get<string>(PLANO_MINIMO, context.getHandler());
    if (!planoMinimo) return true; // se não tiver decorator, libera

    const request = context.switchToHttp().getRequest();
    const username = request.user?.username;
    if (!username) throw new ForbiddenException('Usuário não autenticado');

    const user = await this.usersService.findOne(username);
    if (!user) throw new ForbiddenException('Usuário não encontrado');

    // Verificar se o trial expirou (plano free e passou da data)
    if (user.plano === 'free' && user.trialEndsAt) {
      const agora = new Date();
      if (agora > new Date(user.trialEndsAt)) {
        throw new ForbiddenException(
          'Seu período de teste expirou. Faça upgrade para continuar.',
        );
      }
    }

    // Hierarquia de planos (free < basic < pro < premium)
    const hierarquia = ['free', 'basic', 'pro', 'premium'];
    const nivelUsuario = hierarquia.indexOf(user.plano || 'free');
    const nivelExigido = hierarquia.indexOf(planoMinimo);

    if (nivelUsuario < nivelExigido) {
      throw new ForbiddenException(
        `Seu plano (${user.plano}) não permite esta funcionalidade. Faça upgrade para ${planoMinimo} ou superior.`,
      );
    }

    return true;
  }
}
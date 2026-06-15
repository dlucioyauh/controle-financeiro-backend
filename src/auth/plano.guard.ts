import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class PlanoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // injetado pelo AuthGuard

    if (!user || !user.userId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const userData = await this.usersService.findById(user.userId);
    if (!userData) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    const userPlan = userData.plano?.toLowerCase() || 'free';

    // Defina os planos permitidos (apenas Pro e Premium)
    const allowedPlans = ['pro', 'premium'];
    if (!allowedPlans.includes(userPlan)) {
      throw new ForbiddenException('Seu plano não permite acesso a esta funcionalidade. Faça upgrade para Pro ou Premium.');
    }

    return true;
  }
}
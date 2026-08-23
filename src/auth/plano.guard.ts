import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { RequestWithUser } from './auth.guard';

@Injectable()
export class PlanoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const userData = await this.usersService.findById(user.userId);
    if (!userData) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    // ✅ CORREÇÃO: Normalização robusta da string do plano
    const userPlan = String(userData.plano || 'free').toLowerCase().trim();
    const allowedPlans = ['pro', 'premium'];
    
    if (!allowedPlans.includes(userPlan)) {
      throw new ForbiddenException(`Seu plano atual (${userPlan}) não permite acesso a esta funcionalidade. Faça upgrade para Pro ou Premium.`);
    }

    return true;
  }
}
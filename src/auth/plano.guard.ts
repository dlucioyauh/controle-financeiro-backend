import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import type { Request } from 'express';

@Injectable()
export class PlanoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Tipagem via genérico do NestJS, evitando decoradores com tipos customizados
    const request = context.switchToHttp().getRequest<Request & { user?: { userId: string; username: string } }>();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const userData = await this.usersService.findById(user.userId);
    if (!userData) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    const userPlan = userData.plano?.toLowerCase() || 'free';
    const allowedPlans = ['pro', 'premium'];
    
    if (!allowedPlans.includes(userPlan)) {
      throw new ForbiddenException('Seu plano não permite acesso a esta funcionalidade. Faça upgrade para Pro ou Premium.');
    }

    return true;
  }
}
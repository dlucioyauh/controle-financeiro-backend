import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import type { Request } from 'express';

@Injectable()
export class LimiteClientesGuard implements CanActivate {
  private limites = {
    free: 10,
    basic: 50,
    pro: Infinity,
    premium: Infinity,
  };

  constructor(
    private usersService: UsersService,
    @InjectRepository(Customer) private clienteRepo: Repository<Customer>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: { userId: string; username: string } }>();
    const user = request.user;
    
    if (!user || !user.userId) {
      return true; // Deixa o AuthGuard lidar com a rejeição se não houver usuário
    }

    const userData = await this.usersService.findById(user.userId);
    const userPlan = userData?.plano?.toLowerCase() || 'free';
    const limite = this.limites[userPlan as keyof typeof this.limites] ?? this.limites.free;
    
    if (limite === Infinity) return true;

    // ✅ CORREÇÃO DE SEGURANÇA: Filtrar por userId, nunca por username (LGPD)
    const count = await this.clienteRepo.count({ where: { userId: user.userId } });
    
    if (count >= limite) {
      throw new ForbiddenException(
        `Limite de clientes (${limite}) atingido. Faça upgrade para adicionar mais.`,
      );
    }
    
    return true;
  }
}
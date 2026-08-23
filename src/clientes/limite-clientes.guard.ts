import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { RequestWithUser } from '../auth/auth.guard';

@Injectable()
export class LimiteClientesGuard implements CanActivate {
  private limites: Record<string, number> = {
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
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    
    if (!user || !user.userId) {
      return true;
    }

    const userData = await this.usersService.findById(user.userId);
    const userPlan = userData?.plano?.toLowerCase() || 'free';
    const limite = this.limites[userPlan] ?? this.limites.free;
    
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
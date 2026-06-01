import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

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
    const request = context.switchToHttp().getRequest();
    const username = request.user?.username;
    if (!username) return true;

    const user = await this.usersService.findOne(username);
    const limite = this.limites[user?.plano || 'free'];
    if (limite === Infinity) return true;

    const count = await this.clienteRepo.count({ where: { usuario: username } });
    if (count >= limite) {
      throw new ForbiddenException(
        `Limite de clientes (${limite}) atingido. Faça upgrade para adicionar mais.`,
      );
    }
    return true;
  }
}
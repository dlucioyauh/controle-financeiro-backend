import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { VendaEntity } from './venda.entity';

@Injectable()
export class LimiteVendasGuard implements CanActivate {
  private limites = {
    free: 20,
    basic: 100,
    pro: Infinity,
    premium: Infinity,
  };

  constructor(
    private usersService: UsersService,
    @InjectRepository(VendaEntity) private vendaRepo: Repository<VendaEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const username = request.user?.username;
    if (!username) return true;

    const user = await this.usersService.findOne(username);
    const limite = this.limites[user?.plano || 'free'];
    if (limite === Infinity) return true;

    // Início e fim do mês atual
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const count = await this.vendaRepo.count({
      where: {
        usuario: username,
        dataVenda: Between(inicioMes, fimMes),
      },
    });

    if (count >= limite) {
      throw new ForbiddenException(
        `Limite de vendas (${limite}/mês) atingido. Faça upgrade para continuar vendendo.`,
      );
    }
    return true;
  }
}
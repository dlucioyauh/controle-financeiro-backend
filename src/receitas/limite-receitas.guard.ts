import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceitaEntity } from './receita.entity';

@Injectable()
export class LimiteReceitasGuard implements CanActivate {
  private limites = {
    free: 5,
    basic: 20,
    pro: Infinity,
    premium: Infinity,
  };

  constructor(
    private usersService: UsersService,
    @InjectRepository(ReceitaEntity) private receitaRepo: Repository<ReceitaEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const username = request.user?.username;
    if (!username) return true;

    const user = await this.usersService.findOne(username);
    const limite = this.limites[user?.plano || 'free'];
    if (limite === Infinity) return true;

    const count = await this.receitaRepo.count({ where: { usuario: username } });
    if (count >= limite) {
      throw new ForbiddenException(
        `Limite de receitas (${limite}) atingido. Faça upgrade para adicionar mais.`,
      );
    }
    return true;
  }
}
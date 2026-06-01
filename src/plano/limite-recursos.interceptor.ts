import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Observable } from 'rxjs';

@Injectable()
export class LimiteRecursosInterceptor implements NestInterceptor {
  constructor(
    private usersService: UsersService,
    private recurso: string, // 'clientes', 'receitas', 'vendas'
    private limites: Record<string, number>, // { free: 10, basic: 50, pro: Infinity, premium: Infinity }
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const username = request.user?.username;
    if (!username) return next.handle();

    const user = await this.usersService.findOne(username);
    if (!user) return next.handle();

    const limite = this.limites[user.plano || 'free'];
    if (limite === undefined || limite === Infinity) return next.handle();

    // Contar quantos registros o usuário já tem
    // Precisamos de uma forma de contar; faremos uma query rápida.
    // Como isso depende da entidade, faremos uma injeção genérica.
    // Por simplicidade, vamos contar via manager.query.
    const countResult = await this.usersService['usersRepository'].manager.query(
      `SELECT COUNT(*) FROM ${this.recurso} WHERE usuario = $1`,
      [username],
    );
    const count = parseInt(countResult[0]?.count || '0');

    if (count >= limite) {
      throw new ForbiddenException(
        `Você atingiu o limite de ${this.recurso} do seu plano (${limite}). Faça upgrade para adicionar mais.`,
      );
    }

    return next.handle();
  }
}
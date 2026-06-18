import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserEntity } from '../users/user.entity';

const PLAN_PRICES: Record<string, number> = {
  basic: 29.90,
  pro: 79.90,
  premium: 199.90,
};

@Injectable()
export class AdminMetricsService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
  ) {}

  async getOverview() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Total de usuários
    const totalUsers = await this.usersRepo.count();

    // Usuários ativos (com vendas nos últimos 30 dias)
    const activeUsers = await this.usersRepo
      .createQueryBuilder('u')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('vendas', 'v')
          .where('v.usuario = u.username')
          .andWhere('v.dataVenda >= :thirtyDaysAgo', { thirtyDaysAgo })
          .getQuery();
        return 'EXISTS (' + subQuery + ')';
      })
      .getCount();

    // Novos usuários no mês atual
    const newUsers = await this.usersRepo.count({
      where: {
        createdAt: Between(firstDayOfMonth, firstDayOfNextMonth),
      },
    });

    // MRR: soma dos preços dos planos ativos
    const activeSubscriptions = await this.usersRepo
      .createQueryBuilder('u')
      .where('u.stripeSubscriptionStatus = :status', { status: 'active' })
      .andWhere('u.plano IN (:...planos)', { planos: ['basic', 'pro', 'premium'] })
      .getMany();

    let mrr = 0;
    activeSubscriptions.forEach(u => {
      const price = PLAN_PRICES[u.plano] || 0;
      mrr += price;
    });

    // Trials expirando nos próximos 3 dias
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const trialsExpiring = await this.usersRepo.count({
      where: {
        plano: 'free',
        trialEndsAt: Between(now, threeDaysFromNow),
      },
    });

    // Distribuição de planos
    const plansDistribution = await this.usersRepo
      .createQueryBuilder('u')
      .select('u.plano', 'plano')
      .addSelect('COUNT(*)', 'count')
      .groupBy('u.plano')
      .getRawMany();

    // Conversão trial → pago
    const totalFree = await this.usersRepo.count({ where: { plano: 'free' } });
    const totalPaid = await this.usersRepo.count({
      where: {
        plano: ['basic', 'pro', 'premium'] as any,
        stripeSubscriptionStatus: 'active',
      },
    });
    const conversionRate = totalFree + totalPaid > 0 ? (totalPaid / (totalFree + totalPaid)) * 100 : 0;

    // Receita mensal (últimos 12 meses)
    const revenueByMonth = await this.generateRevenueByMonth();

    return {
      totalUsers,
      activeUsers,
      newUsers,
      mrr,
      trialsExpiring,
      conversionRate,
      plansDistribution,
      revenueByMonth,
    };
  }

  private async generateRevenueByMonth() {
    const now = new Date();
    const result: { month: string; revenue: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now);
      month.setMonth(month.getMonth() - i);
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      const paidUsers = await this.usersRepo
        .createQueryBuilder('u')
        .where('u.stripeSubscriptionStatus = :status', { status: 'active' })
        .andWhere('u.plano IN (:...planos)', { planos: ['basic', 'pro', 'premium'] })
        .andWhere('u.createdAt <= :end', { end })
        .getMany();

      let revenue = 0;
      paidUsers.forEach(u => {
        const price = PLAN_PRICES[u.plano] || 0;
        revenue += price;
      });
      result.push({
        month: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
        revenue,
      });
    }
    return result;
  }
}
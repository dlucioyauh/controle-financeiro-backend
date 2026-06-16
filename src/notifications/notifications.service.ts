import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { UserPreferences } from '../users/user-preferences.entity';
import { MailService } from '../mail/mail.service';
import { VendasService } from '../vendas/vendas.service';
import { DespesasService } from '../despesas/despesas.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
    @InjectRepository(UserPreferences)
    private prefsRepo: Repository<UserPreferences>,
    private mailService: MailService,
    private vendasService: VendasService,
    private despesasService: DespesasService,
  ) {}

  async getPreferences(userId: string): Promise<UserPreferences> {
    let prefs = await this.prefsRepo.findOne({ where: { userId } });
    if (!prefs) {
      prefs = this.prefsRepo.create({ userId });
      prefs = await this.prefsRepo.save(prefs);
    }
    return prefs;
  }

  async updatePreferences(
    userId: string,
    data: { trialRemindersEnabled?: boolean; reportFrequency?: 'weekly' | 'monthly' | 'never' },
  ) {
    const prefs = await this.getPreferences(userId);
    Object.assign(prefs, data);
    return this.prefsRepo.save(prefs);
  }

  private async sendTrialReminder(user: UserEntity, daysRemaining: number) {
    const email = user.email;
    if (!email) {
      this.logger.warn(`Usuário ${user.username} sem e-mail. Ignorando.`);
      return;
    }
    const subject = `⏳ Seu trial do IonFinance expira em ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}`;
    const html = `
      <h1>Olá ${user.nome || user.username},</h1>
      <p>Seu período de teste gratuito termina em <strong>${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}</strong>.</p>
      <p>Para continuar, escolha um plano em <a href="${process.env.FRONTEND_URL}/app/configuracoes">Configurações</a>.</p>
      <p>Equipe IonFinance</p>
    `;
    await this.mailService.sendEmail(email, subject, html);
  }

  private async sendPeriodicReport(user: UserEntity, period: 'weekly' | 'monthly') {
    const email = user.email;
    if (!email) {
      this.logger.warn(`Usuário ${user.username} sem e-mail. Ignorando.`);
      return;
    }
    const agora = new Date();
    const dataFim = agora.toISOString().split('T')[0];
    const dataInicio = new Date(agora);
    if (period === 'weekly') dataInicio.setDate(dataInicio.getDate() - 7);
    else dataInicio.setMonth(dataInicio.getMonth() - 1);
    const inicioStr = dataInicio.toISOString().split('T')[0];

    const vendasStats = await this.vendasService.getEstatisticas(user.username, inicioStr, dataFim);
    const despesasTotais = await this.despesasService.getTotais(user.username, false);
    const totalDespesas = despesasTotais?.total || 0;
    const lucro = vendasStats.totalReceita - totalDespesas;

    const subject = `📊 Relatório ${period === 'weekly' ? 'Semanal' : 'Mensal'} - IonFinance`;
    const html = `
      <h1>Olá ${user.nome || user.username},</h1>
      <p>Resumo do período:</p>
      <ul>
        <li><strong>Vendas:</strong> R$ ${vendasStats.totalReceita.toFixed(2)}</li>
        <li><strong>Despesas:</strong> R$ ${totalDespesas.toFixed(2)}</li>
        <li><strong>Lucro:</strong> R$ ${lucro.toFixed(2)}</li>
        <li><strong>Ticket médio:</strong> R$ ${vendasStats.ticketMedio.toFixed(2)}</li>
        <li><strong>Total de vendas:</strong> ${vendasStats.totalVendas}</li>
      </ul>
      <p>Detalhes em <a href="${process.env.FRONTEND_URL}/app/analytics">Analytics</a>.</p>
      <p>Equipe IonFinance</p>
    `;
    await this.mailService.sendEmail(email, subject, html);
  }

  async checkTrialsAndNotify() {
    this.logger.log('Verificando trials expirando...');
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split('T')[0];
    const em3Dias = new Date(hoje);
    em3Dias.setDate(em3Dias.getDate() + 3);
    const em3Str = em3Dias.toISOString().split('T')[0];

    const users = await this.usersRepo
      .createQueryBuilder('u')
      .where('u.trialEndsAt IS NOT NULL')
      .andWhere('u.trialEndsAt BETWEEN :hoje AND :em3', { hoje: hojeStr, em3: em3Str })
      .getMany();

    for (const user of users) {
      if (!user.trialEndsAt) continue;
      const days = Math.ceil((new Date(user.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (days < 0) continue;
      const prefs = await this.getPreferences(user.id);
      if (!prefs.trialRemindersEnabled) continue;
      if ([3, 1, 0].includes(days)) {
        await this.sendTrialReminder(user, days || 0);
        this.logger.log(`Lembrete enviado para ${user.email} (${days} dias)`);
      }
    }
  }

  async sendPeriodicReports(frequency: 'weekly' | 'monthly') {
    this.logger.log(`Enviando relatórios ${frequency}...`);
    const prefs = await this.prefsRepo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.user', 'u')
      .where('p.reportFrequency = :freq', { freq: frequency })
      .getMany();

    for (const pref of prefs) {
      if (pref.user && pref.user.email) {
        await this.sendPeriodicReport(pref.user, frequency);
        this.logger.log(`Relatório ${frequency} enviado para ${pref.user.email}`);
      }
    }
  }
}

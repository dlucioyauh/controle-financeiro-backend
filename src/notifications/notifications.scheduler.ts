import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsScheduler {
  private readonly logger = new Logger(NotificationsScheduler.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleTrialReminders() {
    this.logger.debug('Verificando trials...');
    try {
      await this.notificationsService.checkTrialsAndNotify();
    } catch (error) {
      this.logger.error('Erro ao verificar trials:', error);
    }
  }

  @Cron('0 8 1 * *')
  async handleMonthlyReports() {
    this.logger.log('Enviando relatórios mensais...');
    try {
      await this.notificationsService.sendPeriodicReports('monthly');
    } catch (error) {
      this.logger.error('Erro ao enviar relatórios mensais:', error);
    }
  }

  @Cron('0 8 * * 1')
  async handleWeeklyReports() {
    this.logger.log('Enviando relatórios semanais...');
    try {
      await this.notificationsService.sendPeriodicReports('weekly');
    } catch (error) {
      this.logger.error('Erro ao enviar relatórios semanais:', error);
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecorrenciasService } from './recorrencias.service';

@Injectable()
export class RecorrenciasScheduler {
  private readonly logger = new Logger(RecorrenciasScheduler.name);

  constructor(private readonly recorrenciasService: RecorrenciasService) {}

  // 🔥 Roda todos os dias às 01:00 AM (horário do servidor)
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleDailyRecorrencias() {
    this.logger.log('🕒 Iniciando job diário de processamento de recorrências...');
    try {
      await this.recorrenciasService.processarRecorrenciasPendentes();
      this.logger.log('✅ Job diário de recorrências finalizado com sucesso.');
    } catch (error) {
      this.logger.error('❌ Falha crítica no job de recorrências:', error);
    }
  }
}
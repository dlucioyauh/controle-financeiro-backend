import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
    private configService: ConfigService,
  ) {}

  @Get()
  async check() {
    const dbStatus = this.connection.isConnected ? 'ok' : 'error';
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    const stripeStatus = stripeKey ? 'configured' : 'missing';

    return {
      status: dbStatus === 'ok' && stripeStatus === 'configured' ? 'healthy' : 'unhealthy',
      database: dbStatus,
      stripe: stripeStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
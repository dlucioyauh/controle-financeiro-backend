import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DespesasModule } from './despesas/despesas.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IngredientesModule } from './ingredientes/ingredientes.module';
import { ReceitasModule } from './receitas/receitas.module';
import { VendasModule } from './vendas/vendas.module';
import { ClientesModule } from './clientes/clientes.module';
import { MailModule } from './mail/mail.module';
import { StripeModule } from './stripe/stripe.module';
import { HealthModule } from './health/health.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { RelatoriosAvancadosModule } from './relatorios-avancados/relatorios-avancados.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminMetricsModule } from './admin-metrics/admin-metrics.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { ThrottlerBehindProxyGuard } from './common/throttler-behind-proxy.guard';
import { ExportModule } from './export/export.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RecorrenciasModule } from './recorrencias/recorrencias.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    CacheModule.register({
      ttl: 300,
      max: 100,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60, 
    }]),
    DespesasModule,
    AuthModule,
    UsersModule,
    IngredientesModule,
    ReceitasModule,
    VendasModule,
    AdminMetricsModule,
    ClientesModule,
    MailModule,
    StripeModule,
    HealthModule,
    FeatureFlagsModule,
    RelatoriosAvancadosModule,
    NotificationsModule,
    WhatsAppModule,
    ExportModule,
    RecorrenciasModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
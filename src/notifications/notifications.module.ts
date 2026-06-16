import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { NotificationsScheduler } from './notifications.scheduler';
import { NotificationsController } from './notifications.controller';
import { UserPreferences } from '../users/user-preferences.entity';
import { UserEntity } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { VendasModule } from '../vendas/vendas.module';
import { DespesasModule } from '../despesas/despesas.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPreferences, UserEntity]),
    ScheduleModule.forRoot(),
    UsersModule,
    MailModule,
    VendasModule,
    DespesasModule,
    AuthModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsScheduler],
  exports: [NotificationsService],
})
export class NotificationsModule {}
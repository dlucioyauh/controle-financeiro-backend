import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMetricsController } from './admin-metrics.controller';
import { AdminMetricsService } from './admin-metrics.service';
import { UserEntity } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule, // ← necessário para o AuthGuard
  ],
  controllers: [AdminMetricsController],
  providers: [AdminMetricsService],
})
export class AdminMetricsModule {}
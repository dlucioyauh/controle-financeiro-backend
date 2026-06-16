import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { PlanoGuard } from './plano.guard';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule), // ← Usar forwardRef para quebrar o ciclo
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PlanoGuard],
  exports: [AuthGuard, PlanoGuard, JwtModule],
})
export class AuthModule {}
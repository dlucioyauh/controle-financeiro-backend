import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { PlanoGuard } from './plano.guard';  // ← novo
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
    UsersModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PlanoGuard],  // ← adicionado
  exports: [AuthGuard, PlanoGuard, JwtModule],      // ← adicionado
})
export class AuthModule {}
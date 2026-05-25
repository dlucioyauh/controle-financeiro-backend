import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UsersModule,
    MailModule,
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret:
          configService.get<string>('JWT_SECRET') ??
          'fallback_apenas_local',
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [AuthService, AuthGuard],

  controllers: [AuthController],

  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
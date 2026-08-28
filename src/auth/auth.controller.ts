import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler'; // ✅ CORREÇÃO: Throttle vem deste pacote
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ BLINDAGEM: Máximo 5 tentativas de login por minuto
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  signIn(
    @Body() body: { username: string; password: string },
  ) {
    return this.authService.signIn(body.username, body.password);
  }

  // ✅ BLINDAGEM: Máximo 3 cadastros por minuto (evita bots criando contas fake)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  register(
    @Body() body: {
      username: string;
      password: string;
      nome?: string;
      email?: string;
      nomeNegocio?: string;
      telefone?: string;
    },
  ) {
    return this.authService.register(body);
  }

  // ✅ BLINDAGEM: Máximo 3 solicitações de recuperação por minuto
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // ✅ BLINDAGEM: Máximo 5 tentativas de redefinição por minuto
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
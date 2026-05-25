import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  signIn(
    @Body()
    body: {
      username: string;
      password: string;
    },
  ) {
    return this.authService.signIn(
      body.username,
      body.password,
    );
  }

  @Post('register')
  register(
    @Body()
    body: {
      username: string;
      password: string;
      nome?: string;
      email?: string;
      nomeNegocio?: string;
      telefone?: string;
    },
  ) {
    return this.authService.register(
      body,
    );
  }
}
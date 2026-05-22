import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.signIn(body.username, body.password);
  }

  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }
}
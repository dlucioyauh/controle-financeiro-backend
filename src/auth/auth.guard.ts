import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // payload tem { sub: uuid, username: string }
      // mapeia para o formato que o controller espera
      request['user'] = {
        userId: payload.sub,
        username: payload.username,
      };
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    if (request.cookies?.auth_token) {
      return request.cookies.auth_token;
    }
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
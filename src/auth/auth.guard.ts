import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  username: string;
}

// Composition em vez de Herança para evitar conflito com o tipo base do Express
export type RequestWithUser = Omit<Request, 'cookies'> & {
  user?: {
    userId: string;
    username: string;
  };
  cookies?: {
    auth_token?: string;
  };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);
    
    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      request.user = {
        userId: payload.sub,
        username: payload.username,
      };
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
    
    return true;
  }

  private extractToken(request: RequestWithUser): string | undefined {
    if (request.cookies?.auth_token) {
      return request.cookies.auth_token;
    }
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
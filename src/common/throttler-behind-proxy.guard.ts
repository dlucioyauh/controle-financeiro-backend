import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Pega o IP real do header x-forwarded-for (proxy Railway) ou fallback para req.ip
    return req.headers['x-forwarded-for'] || req.ip || 'unknown';
  }
}
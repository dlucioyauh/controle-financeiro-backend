import { Controller, Get, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminMetricsService } from './admin-metrics.service';
import type { Request } from 'express';

const ADMIN_USERNAMES = ['dlucio', 'admin'];

@Controller('admin/metrics')
@UseGuards(AuthGuard)
export class AdminMetricsController {
  constructor(private readonly metricsService: AdminMetricsService) {}

  @Get('overview')
  async getOverview(@Req() req: Request) {
    // Cast seguro e inline: satisfaz o TypeScript sem violar isolatedModules no decorador
    const user = req.user as { userId: string; username: string } | undefined;
    
    if (!user || !ADMIN_USERNAMES.includes(user.username)) {
      throw new ForbiddenException('Acesso restrito ao administrador');
    }
    return this.metricsService.getOverview();
  }
}
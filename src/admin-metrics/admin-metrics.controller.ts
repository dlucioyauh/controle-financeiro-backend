import { Controller, Get, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdminMetricsService } from './admin-metrics.service';
import type { Request } from 'express';

@Controller('admin/metrics')
@UseGuards(AuthGuard)
export class AdminMetricsController {
  constructor(private readonly metricsService: AdminMetricsService) {}

  @Get('overview')
  async getOverview(@Req() req: Request) {
    const user = (req as any).user;
    if (user?.username !== 'dlucio') {
      throw new ForbiddenException('Acesso restrito ao administrador');
    }
    return this.metricsService.getOverview();
  }
}
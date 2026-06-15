import { Controller, Get, Patch, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('admin/features')
@UseGuards(AuthGuard)
export class AdminFeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Get()
  async getAllFlags(@Req() req: Request) {
    const user = (req as any).user;
    if (user?.username !== 'dlucio') {
      throw new ForbiddenException('Acesso restrito ao administrador');
    }
    return this.featureFlagsService.findAll();
  }

  @Patch(':id')
  async toggleFlag(
    @Param('id') id: string,
    @Body('enabled') enabled: boolean,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    if (user?.username !== 'dlucio') {
      throw new ForbiddenException('Acesso restrito ao administrador');
    }
    return this.featureFlagsService.updateFlag(id, enabled, user.username);
  }
}
import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('preferences')
  async getPreferences(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.notificationsService.getPreferences(userId);
  }

  @Patch('preferences')
  async updatePreferences(
    @Req() req: Request,
    @Body() body: { trialRemindersEnabled?: boolean; reportFrequency?: 'weekly' | 'monthly' | 'never' },
  ) {
    const userId = (req as any).user?.userId;
    return this.notificationsService.updatePreferences(userId, body);
  }
}

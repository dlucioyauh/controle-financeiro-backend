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
    // Fallback: userId pode estar em user.userId ou user.sub
    const userId = (req as any).user?.userId || (req as any).user?.sub;
    return this.notificationsService.getPreferences(userId);
  }

  @Patch('preferences')
  async updatePreferences(
    @Req() req: Request,
    @Body() body: { trialRemindersEnabled?: boolean; reportFrequency?: 'weekly' | 'monthly' | 'never' },
  ) {
    const userId = (req as any).user?.userId || (req as any).user?.sub;
    return this.notificationsService.updatePreferences(userId, body);
  }
}
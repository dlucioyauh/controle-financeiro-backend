import { Controller, Get, UseGuards } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('features')
@UseGuards(AuthGuard)
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Get()
  async getEnabledFlags() {
    return this.featureFlagsService.getEnabledFlags();
  }
}
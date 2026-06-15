import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlagEntity } from './feature-flag.entity';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlagsController } from './feature-flags.controller';
import { AdminFeatureFlagsController } from './admin-feature-flags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlagEntity])],
  controllers: [FeatureFlagsController, AdminFeatureFlagsController],
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
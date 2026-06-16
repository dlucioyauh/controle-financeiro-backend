import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './user.entity';
import { UserPreferences } from './user-preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserPreferences]), // ← adicionado UserPreferences
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
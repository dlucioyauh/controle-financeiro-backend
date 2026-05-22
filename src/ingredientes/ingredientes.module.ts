import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientesService } from './ingredientes.service.js';
import { IngredientesController } from './ingredientes.controller.js';
import { IngredienteEntity } from './ingrediente.entity.js';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([IngredienteEntity]), AuthModule],
  controllers: [IngredientesController],
  providers: [IngredientesService],
  exports: [IngredientesService],
})
export class IngredientesModule {}
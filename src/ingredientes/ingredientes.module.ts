import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientesService } from './ingredientes.service.js';
import { IngredientesController } from './ingredientes.controller.js';
import { IngredienteEntity } from './ingrediente.entity.js'; // Mudou aqui

@Module({
  imports: [TypeOrmModule.forFeature([IngredienteEntity])], // Mudou aqui
  controllers: [IngredientesController],
  providers: [IngredientesService],
  exports: [IngredientesService], // Garante a exportação se receitas usar ele
})
export class IngredientesModule {}
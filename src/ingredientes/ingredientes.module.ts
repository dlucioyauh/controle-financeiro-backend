import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingrediente } from './ingrediente.entity';
import { IngredientesService } from './ingredientes.service';
import { IngredientesController } from './ingredientes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ingrediente])],
  providers: [IngredientesService],
  controllers: [IngredientesController],
  exports: [IngredientesService],
})
export class IngredientesModule {}
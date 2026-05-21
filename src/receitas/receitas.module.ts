import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceitasService } from './receitas.service.js';
import { ReceitasController } from './receitas.controller.js';
import { ReceitaEntity } from './receita.entity.js'; // Mudou aqui

@Module({
  imports: [TypeOrmModule.forFeature([ReceitaEntity])], // Mudou aqui
  controllers: [ReceitasController],
  providers: [ReceitasService],
})
export class ReceitasModule {}
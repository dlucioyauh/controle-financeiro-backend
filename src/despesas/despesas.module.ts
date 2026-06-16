import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesasController } from './despesas.controller';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DespesaEntity])],
  controllers: [DespesasController],
  providers: [DespesasService],
  exports: [DespesasService], // ← ESSENCIAL
})
export class DespesasModule {}
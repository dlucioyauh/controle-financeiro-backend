import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesaEntity } from './despesa.entity';
import { DespesasService } from './despesas.service';
import { DespesasController } from './despesas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DespesaEntity])],
  controllers: [DespesasController],
  providers: [DespesasService],
})
export class DespesasModule {}
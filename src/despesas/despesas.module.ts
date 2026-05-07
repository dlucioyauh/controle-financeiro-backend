import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despesa } from './despesa.entity';
import { DespesasService } from './despesas.service';
import { DespesasController } from './despesas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa])],
  controllers: [DespesasController],
  providers: [DespesasService],
})
export class DespesasModule {}
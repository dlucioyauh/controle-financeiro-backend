import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecorrenciaEntity } from './recorrencia.entity';
import { RecorrenciasService } from './recorrencias.service';
import { RecorrenciasController } from './recorrencias.controller';
import { RecorrenciasScheduler } from './recorrencias.scheduler';
import { DespesaEntity } from '../despesas/despesa.entity'; // Ajuste se necessário
import { VendaEntity } from '../vendas/venda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecorrenciaEntity, DespesaEntity, VendaEntity]),
  ],
  controllers: [RecorrenciasController],
  providers: [RecorrenciasService, RecorrenciasScheduler],
  exports: [RecorrenciasService],
})
export class RecorrenciasModule {}
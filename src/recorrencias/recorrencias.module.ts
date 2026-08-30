import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecorrenciaEntity } from './recorrencia.entity';
import { RecorrenciasService } from './recorrencias.service';
import { RecorrenciasController } from './recorrencias.controller';
import { RecorrenciasScheduler } from './recorrencias.scheduler';
import { DespesaEntity } from '../despesas/despesa.entity';
import { VendaEntity } from '../vendas/venda.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([RecorrenciaEntity, DespesaEntity, VendaEntity]),
    AuthModule, 
  ],
  controllers: [RecorrenciasController],
  providers: [RecorrenciasService, RecorrenciasScheduler],
  exports: [RecorrenciasService],
})
export class RecorrenciasModule {}
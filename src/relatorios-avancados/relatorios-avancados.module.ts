import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from '../vendas/venda.entity';
import { DespesaEntity } from '../despesas/despesa.entity';
import { Customer } from '../clientes/customer.entity';
import { RelatoriosAvancadosService } from './relatorios-avancados.service';
import { RelatoriosAvancadosController } from './relatorios-avancados.controller';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity, DespesaEntity, Customer]),
    FeatureFlagsModule,
    AuthModule,
  ],
  controllers: [RelatoriosAvancadosController],
  providers: [RelatoriosAvancadosService],
})
export class RelatoriosAvancadosModule {}
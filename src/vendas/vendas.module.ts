import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity'; // Corrigido aqui

@Module({
  imports: [TypeOrmModule.forFeature([VendaEntity])], // Corrigido aqui
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venda } from './venda.entity';
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Venda])],
  providers: [VendasService],
  controllers: [VendasController],
})
export class VendasModule {}
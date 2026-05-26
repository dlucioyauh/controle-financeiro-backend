import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from './venda.entity';
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity]),
    AuthModule,
  ],
  controllers: [VendasController],
  providers: [VendasService],
})
export class VendasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity]),
    ClientesModule,
    UsersModule,
  ],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService], // ← ESSENCIAL
})
export class VendasModule {}
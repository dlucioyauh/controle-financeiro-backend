import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from './venda.entity';
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ClientesModule } from '../clientes/clientes.module';
import { LimiteVendasGuard } from './limite-vendas.guard';   // ← novo

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity]),
    AuthModule,
    UsersModule,
    ClientesModule,
  ],
  controllers: [VendasController],
  providers: [VendasService, LimiteVendasGuard],   // ← adicionado
})
export class VendasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from './venda.entity';
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ClientesModule } from '../clientes/clientes.module';  // ← NOVA IMPORTAÇÃO

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity]),
    AuthModule,
    UsersModule,
    ClientesModule,  // ← NOVO MÓDULO
  ],
  controllers: [VendasController],
  providers: [VendasService],
})
export class VendasModule {}
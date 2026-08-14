import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { UsersModule } from '../users/users.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module'; // ← Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity]),
    ClientesModule,
    UsersModule,
    WhatsAppModule, // ← Adicionar
  ],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { VendaEntity } from './venda.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { UsersModule } from '../users/users.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { AuthModule } from '../auth/auth.module'; // ← Importar AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity]),
    ClientesModule,
    UsersModule,
    WhatsAppModule,
    AuthModule, // ← Necessário para o AuthGuard
  ],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
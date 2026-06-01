import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { LimiteClientesGuard } from './limite-clientes.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';   // ← NOVO

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    AuthModule,
    UsersModule,   // ← NOVO
  ],
  controllers: [ClientesController],
  providers: [ClientesService, LimiteClientesGuard],
  exports: [ClientesService],
})
export class ClientesModule {}
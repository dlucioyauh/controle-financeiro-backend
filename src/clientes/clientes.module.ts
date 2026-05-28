import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { AuthModule } from '../auth/auth.module';   // ← import ESSENCIAL

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    AuthModule,                                    // ← fornece AuthGuard, JwtService, ConfigService
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { VendaEntity } from '../vendas/venda.entity';
import { AuthModule } from '../auth/auth.module'; // ✅ ADICIONADO: Fornece JwtService e ConfigService

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaEntity]),
    AuthModule, // ✅ ADICIONADO: Resolve a dependência do AuthGuard
  ],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
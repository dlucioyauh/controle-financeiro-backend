import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { VendaEntity } from '../vendas/venda.entity'; // ✅ Nome correto

@Module({
  imports: [TypeOrmModule.forFeature([VendaEntity])],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
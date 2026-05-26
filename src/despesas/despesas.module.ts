import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesaEntity } from './despesa.entity';
import { DespesasService } from './despesas.service';
import { DespesasController } from './despesas.controller';
import { AuthModule } from '../auth/auth.module';   // ← ESSENCIAL

@Module({
  imports: [
    TypeOrmModule.forFeature([DespesaEntity]),
    AuthModule,   // ← ESSENCIAL
  ],
  controllers: [DespesasController],
  providers: [DespesasService],
})
export class DespesasModule {}
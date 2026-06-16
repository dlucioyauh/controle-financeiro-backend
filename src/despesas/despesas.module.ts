import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesasController } from './despesas.controller';
import { DespesasService } from './despesas.service';
import { DespesaEntity } from './despesa.entity';
import { AuthModule } from '../auth/auth.module'; // ← Importante

@Module({
  imports: [
    TypeOrmModule.forFeature([DespesaEntity]),
    AuthModule, // ← Adiciona o módulo de autenticação
  ],
  controllers: [DespesasController],
  providers: [DespesasService],
  exports: [DespesasService],
})
export class DespesasModule {}
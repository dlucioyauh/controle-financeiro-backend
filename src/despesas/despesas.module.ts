import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despesa } from './despesa.entity';
import { DespesasService } from './despesas.service';
import { DespesasController } from './despesas.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa]), AuthModule],
  controllers: [DespesasController],
  providers: [DespesasService],
})
export class DespesasModule {}
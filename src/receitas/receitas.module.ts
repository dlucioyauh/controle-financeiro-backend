import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceitasController } from './receitas.controller';
import { ReceitasService } from './receitas.service';
import { ReceitaEntity } from './receita.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReceitaEntity]), AuthModule],
  controllers: [ReceitasController],
  providers: [ReceitasService],
})
export class ReceitasModule {}
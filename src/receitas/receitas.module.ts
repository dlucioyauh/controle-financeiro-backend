import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receita } from './receita.entity';
import { ReceitasService } from './receitas.service';
import { ReceitasController } from './receitas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Receita])],
  providers: [ReceitasService],
  controllers: [ReceitasController],
})
export class ReceitasModule {}
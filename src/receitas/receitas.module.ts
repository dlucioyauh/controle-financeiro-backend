import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceitaEntity } from './receita.entity';
import { ReceitasService } from './receitas.service';
import { ReceitasController } from './receitas.controller';
import { LimiteReceitasGuard } from './limite-receitas.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReceitaEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ReceitasController],
  providers: [ReceitasService, LimiteReceitasGuard],
  exports: [ReceitasService],
})
export class ReceitasModule {}
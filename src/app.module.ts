import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DespesasModule } from './despesas/despesas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'controle_financeiro',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DespesasModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
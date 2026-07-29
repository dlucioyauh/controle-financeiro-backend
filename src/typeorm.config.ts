import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Carrega as variáveis do .env
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get('DB_PORT') || '5432'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  database: configService.get('DB_NAME'),
  // Define onde estão as Entidades (para ler a estrutura das tabelas)
  entities: ['dist/**/*.entity{.ts,.js}'], 
  // Define onde as Migrações serão geradas e lidas
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
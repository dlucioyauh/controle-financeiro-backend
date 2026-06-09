import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://controle-financeiro-frontend-two.vercel.app',
      'https://controle-financeiro-frontend-git-develop-dlucioyauhs-projects.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Middleware para preservar o corpo bruto na rota de webhook do Stripe
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
}

bootstrap();
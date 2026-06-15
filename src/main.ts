import * as bodyParser from 'body-parser';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SentryFilter } from './filters/sentry.filter';

async function bootstrap() {
  // Inicializa o Sentry antes de qualquer coisa
  Sentry.init({
    dsn: 'https://20605ba23be3149ba2c580ef3ee08979@o4511559401668608.ingest.us.sentry.io/4511559409598464',
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    environment: process.env.RAILWAY_ENVIRONMENT || 'development',
  });

  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Configuração CORS aprimorada para aceitar previews do Vercel
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://controle-financeiro-frontend-two.vercel.app',
      /\.vercel\.app$/,               // Aceita qualquer subdomínio .vercel.app
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global do Sentry – captura toda exceção não tratada
  app.useGlobalFilters(new SentryFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
}

bootstrap();
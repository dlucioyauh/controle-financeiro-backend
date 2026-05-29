import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://controle-financeiro-frontend-two.vercel.app',
    'https://controle-financeiro-frontend-git-develop-dlucioyauhs-projects.vercel.app' // ← Staging preview
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  });

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

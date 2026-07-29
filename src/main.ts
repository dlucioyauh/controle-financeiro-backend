import * as bodyParser from 'body-parser';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// --- Filtro Global de Exceções (Para printar o erro no navegador) ---
import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 1. Imprime o erro DETALHADO no console do Railway (onde você estava procurando)
    console.error('🔥 ERRO DETALHADO NO SERVIDOR:', exception);

    // 2. Envia o erro para o Sentry
    Sentry.captureException(exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || 'Erro interno do servidor';

    // 3. Retorna o erro em JSON para o navegador (F12 vai mostrar exatamente o que falta)
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      stack: process.env.NODE_ENV === 'production' ? undefined : exception.stack,
    });
  }
}
// ----------------------------------------------------------------

async function bootstrap() {
  Sentry.init({
    dsn: 'https://20605ba23be3149ba2c580ef3ee08979@o4511559401668608.ingest.us.sentry.io/4511559409598464',
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    environment: process.env.RAILWAY_ENVIRONMENT || 'development',
  });

  const app = await NestFactory.create(AppModule, { rawBody: true });

  // CORS – permite origens locais, produção e previews do Vercel
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://controle-financeiro-frontend-two.vercel.app',
      /\.vercel\.app$/, // aceita qualquer subdomínio do Vercel (ex: preview-xyz.vercel.app)
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

  // Substituindo o antigo SentryFilter pelo nosso filtro customizado
  app.useGlobalFilters(new GlobalErrorFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
}

bootstrap();
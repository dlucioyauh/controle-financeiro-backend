import * as bodyParser from 'body-parser';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// --- Filtro Global de Exceções ---
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.error('🔥 ERRO DETALHADO NO SERVIDOR:', exception);
    Sentry.captureException(exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || 'Erro interno do servidor';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      stack:
        process.env.NODE_ENV === 'production' ? undefined : exception.stack,
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

  // 🔧 CORS dinâmico e flexível
  const corsOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      // Localhost
      'http://localhost:5173',
      'http://localhost:3000',
      // Produção
      'https://ionfinance.com.br',
      'https://www.ionfinance.com.br',
      'https://api.ionfinance.com.br',
      // Padrão para previews da Vercel (qualquer subdomínio .vercel.app)
      /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/,
      // Padrão específico para projetos do usuário
      /^https:\/\/([a-z0-9-]+\.)*dlucioyauhs-projects\.vercel\.app$/,
    ];

    // Permite requisições sem origin (ex: Postman, curl, mobile)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Verifica se a origem está na lista ou corresponde a algum padrão
    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      return allowed.test(origin);
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`🚫 Origem bloqueada pelo CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  };

  app.enableCors({
    origin: corsOrigin,
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

  app.useGlobalFilters(new GlobalErrorFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
}

bootstrap();
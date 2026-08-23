import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryFilter.name);

  // Lista de chaves sensíveis que devem ser redigidas dos logs (case-insensitive)
  private readonly sensitiveKeys = [
    'password',
    'senha',
    'senhaatual',
    'novasenha',
    'confirmarsenha',
    'token',
    'accesstoken',
    'refreshtoken',
    'apikey',
    'secret',
    'stripe_secret_key',
    'cardnumber',
    'cvv',
  ];

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 1. Sanitiza os dados do request antes de enviar ao Sentry
    const sanitizedRequest = this.sanitizeRequestData(request);
    const sanitizedHeaders = this.sanitizeHeaders(request.headers);

    // 2. Usa com escopo isolado para evitar conflitos de tipo e garantir segurança
    Sentry.withScope((scope) => {
      // Adiciona dados do request de forma segura e tipada
      scope.setExtra('request_url', request.url);
      scope.setExtra('request_method', request.method);
      scope.setExtra('request_body', sanitizedRequest.body);
      scope.setExtra('request_query', sanitizedRequest.query);
      scope.setExtra('request_params', sanitizedRequest.params);
      scope.setExtra('request_headers', sanitizedHeaders);

      // Adiciona usuário de forma anonimizada (apenas IDs, sem e-mail ou dados pessoais)
      if (request.user && request.user.userId) {
        scope.setUser({
          id: request.user.userId,
          username: request.user.username || 'unknown',
        });
      }

      // Captura a exceção com o escopo enriquecido e seguro
      Sentry.captureException(exception);
    });

    this.logger.error(
      `Exception caught: ${exception instanceof Error ? exception.message : String(exception)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 3. Retorna a resposta padrão de erro para o cliente (sem vazar detalhes internos)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Ocorreu um erro interno no servidor.';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Sanitiza recursivamente um objeto, redigindo chaves sensíveis.
   */
  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Cria uma cópia superficial para não mutar o objeto original do request
    const cloned = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in cloned) {
      const lowerKey = key.toLowerCase();
      
      // Se a chave for sensível, redige o valor
      if (this.sensitiveKeys.includes(lowerKey)) {
        cloned[key] = '[REDACTED]';
      } 
      // Se for um objeto aninhado, aplica a sanitização recursivamente
      else if (typeof cloned[key] === 'object' && cloned[key] !== null) {
        cloned[key] = this.sanitizeObject(cloned[key]);
      }
    }

    return cloned;
  }

  /**
   * Sanitiza os dados principais do request (body, query, params).
   */
  private sanitizeRequestData(req: any) {
    return {
      body: this.sanitizeObject(req.body),
      query: this.sanitizeObject(req.query),
      params: this.sanitizeObject(req.params),
    };
  }

  /**
   * Sanitiza headers, removendo tokens de autorização e cookies.
   */
  private sanitizeHeaders(headers: any) {
    if (!headers) return {};
    
    const sanitized = { ...headers };
    if (sanitized.authorization) {
      sanitized.authorization = '[REDACTED]';
    }
    if (sanitized.cookie) {
      sanitized.cookie = '[REDACTED]';
    }
    
    return sanitized;
  }
}
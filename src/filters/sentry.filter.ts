import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Request } from 'express';

@Catch()
export class SentryFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    // Redact sensitive data from request body
    const safeBody = this.redactSensitiveData(request.body);
    const safeUser = request.user ? { id: (request.user as any).id } : null;

    Sentry.withScope((scope) => {
      scope.setExtra('request', {
        url: request.url,
        method: request.method,
        body: safeBody,
        user: safeUser,
      });
      Sentry.captureException(exception);
    });

    const status = exception.getStatus ? exception.getStatus() : 500;
    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
    });
  }

  private redactSensitiveData(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sensitiveFields = new Set([
      'password',
      'senha',
      'currentpassword',
      'newpassword',
      'token',
      'refreshtoken',
      'secret',
      'apikey',
      'authorization',
    ]);

    const redacted = Array.isArray(body) ? [] : {};

    for (const [key, value] of Object.entries(body)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveFields.has(lowerKey)) {
        redacted[key] = '[REDACTED]';
      } else if (value && typeof value === 'object') {
        redacted[key] = this.redactSensitiveData(value);
      } else {
        redacted[key] = value;
      }
    }
    return redacted;
  }
}
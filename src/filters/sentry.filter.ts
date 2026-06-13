import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    Sentry.withScope((scope) => {
      scope.setExtra('request', {
        url: request.url,
        method: request.method,
        body: request.body,
        user: request.user,
      });
      Sentry.captureException(exception);
    });

    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;
    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
    });
  }
}
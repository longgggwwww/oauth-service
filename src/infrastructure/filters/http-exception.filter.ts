import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  DomainException,
  InvalidCredentialsException,
  UserNotFoundException,
  UserNotActiveException,
} from '@src/core/domain/exceptions/domain-exceptions';
import { ClientNotFoundException } from '@src/core/domain/exceptions/domain.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message =
        typeof response === 'string'
          ? response
          : (response as any).message || 'An error occurred';
    } else if (exception instanceof InvalidCredentialsException) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid credentials';
    } else if (exception instanceof UserNotFoundException) {
      // For security, we might want to return 401 or 404.
      // Returning 404 reveals user existence, but is often useful for debugging.
      // Let's use 404 as per plan, or 401 if strict security is needed.
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof ClientNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof UserNotActiveException) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}

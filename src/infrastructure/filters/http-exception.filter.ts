import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException, InvalidCredentialsException, UserNotFoundException, UserNotActiveException } from '@src/core/domain/exceptions/domain-exceptions';

@Catch(DomainException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message;

        if (exception instanceof InvalidCredentialsException) {
            status = HttpStatus.UNAUTHORIZED;
            message = 'Invalid credentials';
        } else if (exception instanceof UserNotFoundException) {
            // For security, we might want to return 401 or 404. 
            // Returning 404 reveals user existence, but is often useful for debugging.
            // Let's use 404 as per plan, or 401 if strict security is needed.
            status = HttpStatus.NOT_FOUND;
        } else if (exception instanceof UserNotActiveException) {
            status = HttpStatus.FORBIDDEN;
        }

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: message,
            });
    }
}

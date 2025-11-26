import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Known request errors from Prisma
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint failed
      if (exception.code === 'P2002') {
        const err = new ConflictException('Resource already exists');
        return response.status(err.getStatus()).json({
          statusCode: err.getStatus(),
          timestamp: new Date().toISOString(),
          path: request.url,
          message: err.message,
        });
      }

      // Record not found for update/delete
      if (exception.code === 'P2025') {
        const err = new NotFoundException('Requested resource not found');
        return response.status(err.getStatus()).json({
          statusCode: err.getStatus(),
          timestamp: new Date().toISOString(),
          path: request.url,
          message: err.message || err.message,
        });
      }

      // Fallback for other known request errors
      const err = new InternalServerErrorException('Database error');
      return response.status(err.getStatus()).json({
        statusCode: err.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message: err.message || 'Database error',
      });
    }

    // Validation errors from Prisma
    if (exception instanceof Prisma.PrismaClientValidationError) {
      const err = new BadRequestException('Invalid query or data');
      return response.status(err.getStatus()).json({
        statusCode: err.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message: err.message || 'Invalid query or data',
      });
    }

    // Not a Prisma error we expected; rethrow so other filters can handle
    throw exception;
  }
}

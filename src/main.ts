import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { PrismaExceptionFilter } from './infrastructure/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert types
      },
    }),
  );

  // Enable Prisma exception filter first so Prisma-specific errors are handled
  app.useGlobalFilters(new PrismaExceptionFilter(), new HttpExceptionFilter());

  // Enable API versioning with /v1 prefix
  app.setGlobalPrefix('v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

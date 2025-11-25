import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserRequest } from './dto/requests/register-user.request';
import { LoginRequest } from './dto/requests/login.request';
import { VerifyEmailRequest } from './dto/requests/verify-email.request';
import { ResendVerificationEmailRequest } from './dto/requests/resend-verification-email.request';

import { RegisterUserCommand } from '@src/core/application/use-cases/auth/commands/register-user.command';
import { AuthenticateCommand } from '@src/core/application/use-cases/auth/commands/authenticate.command';
import { VerifyEmailCommand } from '@src/core/application/use-cases/auth/commands/verify-email.command';
import { ResendVerificationEmailCommand } from '@src/core/application/use-cases/auth/commands/resend-verification-email.command';

import { LogoutCommand } from '@src/core/application/use-cases/auth/commands/logout.command';
import { ClientCredentialsGuard } from '@src/infrastructure/common/guards/client-credentials.guard';
import { JwtAuthGuard } from '@src/infrastructure/common/guards/jwt-auth.guard';
import { CurrentUser } from '@src/infrastructure/common/decorators/current-user.decorator';

/**
 * AuthController
 * Handles Identity Provider (IdP) session management.
 * Used by the IdP frontend for user login/registration/logout.
 * API clients should use OauthController for tokens.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @UseGuards(ClientCredentialsGuard)
  async register(@Body() request: RegisterUserRequest) {
    const command = new RegisterUserCommand(
      request.email,
      request.phoneNumber,
      request.fullName,
      request.password,
      request.givenName,
      request.familyName,
      request.picture,
      request.avatarUrl,
      request.locale,
      request.timezone,
      request.birthDate,
    );
    return this.commandBus.execute(command);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() request: LoginRequest) {
    const command = new AuthenticateCommand(
      request.email,
      request.password,
      request.clientId,
      request.clientSecret,
      request.mfaToken,
    );
    return this.commandBus.execute(command);
  }

  @Get('verify-email')
  async verifyEmail(@Query() request: VerifyEmailRequest) {
    const command = new VerifyEmailCommand(request.token);
    return this.commandBus.execute(command);
  }

  @Post('resend-verification')
  async resendVerification(@Body() request: ResendVerificationEmailRequest) {
    const command = new ResendVerificationEmailCommand(request.email);
    return this.commandBus.execute(command);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    // Extract userId from JWT token
    const userId = user.sub;
    if (!userId) {
      throw new BadRequestException(
        'User ID not found in token. This endpoint requires user authentication, not client credentials.',
      );
    }
    const command = new LogoutCommand(userId);
    await this.commandBus.execute(command);
  }
}

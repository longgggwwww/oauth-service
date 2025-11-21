import { Controller, Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserRequest } from './dto/requests/register-user.request';
import { LoginRequest } from './dto/requests/login.request';

import { RegisterUserCommand } from '@src/core/application/use-cases/auth/commands/register-user.command';
import { AuthenticateCommand } from '@src/core/application/use-cases/auth/commands/authenticate.command';

import { LogoutCommand } from '@src/core/application/use-cases/auth/commands/logout.command';

/**
 * AuthController
 * Handles Identity Provider (IdP) session management.
 * Used by the IdP frontend for user login/registration/logout.
 * API clients should use OauthController for tokens.
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly commandBus: CommandBus) { }

    @Post('register')
    async register(@Body() request: RegisterUserRequest) {
        const command = new RegisterUserCommand(
            request.email,
            request.password,
            request.username,
            request.phoneNumber,
        );
        return this.commandBus.execute(command);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() request: LoginRequest) {
        const command = new AuthenticateCommand(
            request.email,
            request.password,
            request.mfaToken,
        );
        return this.commandBus.execute(command);
    }



    @Post('logout')
    @HttpCode(204)
    async logout(@Body() body: { userId: string }) { // In real app, get userId from JWT
        // TODO: Extract userId from token/guard
        const command = new LogoutCommand(body.userId);
        await this.commandBus.execute(command);
    }
}

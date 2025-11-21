import { Controller, Post, Body, UseGuards, Req, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EnableMfaRequest } from './dto/requests/enable-mfa.request';
import { VerifyMfaRequest } from './dto/requests/verify-mfa.request';
import { PasskeyRegistrationRequest } from './dto/requests/passkey-registration.request';
import { PasskeyAuthRequest } from './dto/requests/passkey-auth.request';
import { MfaSetupResponse } from './dto/responses/mfa-setup.response';
import { EnableMfaCommand } from '@src/core/application/use-cases/mfa/commands/enable-mfa.command';
import { VerifyMfaCommand } from '@src/core/application/use-cases/mfa/commands/verify-mfa.command';
import { DisableMfaCommand } from '@src/core/application/use-cases/mfa/commands/disable-mfa.command';
import { StartPasskeyRegistrationCommand } from '@src/core/application/use-cases/mfa/commands/start-passkey-registration.command';
import { FinishPasskeyRegistrationCommand } from '@src/core/application/use-cases/mfa/commands/finish-passkey-registration.command';
import { StartPasskeyAuthCommand } from '@src/core/application/use-cases/mfa/commands/start-passkey-auth.command';
import { FinishPasskeyAuthCommand } from '@src/core/application/use-cases/mfa/commands/finish-passkey-auth.command';

@Controller('mfa')
export class MfaController {
    constructor(private readonly commandBus: CommandBus) { }

    @Post('enable')
    async enable(@Body() request: EnableMfaRequest, @Body() body: { userId: string }): Promise<MfaSetupResponse> {
        // TODO: Extract userId from token/guard
        const command = new EnableMfaCommand(body.userId, request.type, request.phoneNumber);
        return this.commandBus.execute(command);
    }

    @Post('verify')
    @HttpCode(200)
    async verify(@Body() request: VerifyMfaRequest, @Body() body: { userId: string }) {
        // TODO: Extract userId from token/guard
        const command = new VerifyMfaCommand(body.userId, request.code, request.secret);
        return this.commandBus.execute(command);
    }

    @Post('disable')
    @HttpCode(204)
    async disable(@Body() body: { userId: string }) {
        // TODO: Extract userId from token/guard
        const command = new DisableMfaCommand(body.userId);
        await this.commandBus.execute(command);
    }

    @Post('passkey/register/start')
    async startPasskeyRegistration(@Body() body: { userId: string }) {
        // TODO: Extract userId from token/guard
        const command = new StartPasskeyRegistrationCommand(body.userId);
        return this.commandBus.execute(command);
    }

    @Post('passkey/register/finish')
    async finishPasskeyRegistration(
        @Body() request: PasskeyRegistrationRequest,
        @Body() body: { userId: string },
    ) {
        // TODO: Extract userId from token/guard
        const command = new FinishPasskeyRegistrationCommand(body.userId, request.attestationResponse);
        return this.commandBus.execute(command);
    }

    @Post('passkey/auth/start')
    async startPasskeyAuth(@Body() body: { email?: string }) {
        const command = new StartPasskeyAuthCommand(body.email);
        return this.commandBus.execute(command);
    }

    @Post('passkey/auth/finish')
    async finishPasskeyAuth(@Body() request: PasskeyAuthRequest) {
        const command = new FinishPasskeyAuthCommand(request.assertionResponse);
        return this.commandBus.execute(command);
    }
}

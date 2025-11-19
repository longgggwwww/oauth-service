import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterClientRequest } from './dto/requests/register-client.request';
import { ClientRegistrationResponse } from './dto/responses/client-registration.response';
import { RegisterClientCommand } from '../../../core/application/use-cases/client/commands/register-client.command';
import { ClientEntity } from '../../../core/domain/entities/client.entity';

@Controller('oauth')
export class OauthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async registerClient(
    @Body() request: RegisterClientRequest,
  ): Promise<ClientRegistrationResponse> {
    // Validate request (in real app, use pipes)
    // For now, assume validation is done

    const command = new RegisterClientCommand(
      request.userId,
      request.clientId,
      request.name,
      request.redirectUris,
      request.description,
      request.grantTypes,
      request.scope,
      request.websiteUrl,
      request.logoUrl,
      request.contacts,
    );

    const client: ClientEntity = await this.commandBus.execute(command);

    return {
      id: client.id,
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      name: client.name,
      redirectUris: client.redirectUris,
      createdAt: client.createdAt,
    };
  }
}

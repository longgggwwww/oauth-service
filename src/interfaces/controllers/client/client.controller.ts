// src/interfaces/controllers/client/client.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetUserClientsQuery } from '@src/core/application/use-cases/client/queries/get-user-clients.query';
import { GetClientQuery } from '@src/core/application/use-cases/client/queries/get-client.query';
import { GetClientByClientIdQuery } from '@src/core/application/use-cases/client/queries/get-client-by-client-id.query';
import { UpdateClientCommand } from '@src/core/application/use-cases/client/commands/update-client.command';
import { DeleteClientCommand } from '@src/core/application/use-cases/client/commands/delete-client.command';
import { ClientListResponse } from './dto/responses/client-list.response';
import { ClientDetailsResponse } from './dto/responses/client-details.response';
import { UpdateClientRequest } from './dto/requests/update-client.request';

import { CreateClientRequest } from './dto/requests/create-client.request';
import { ClientRegistrationResponse } from './dto/responses/client-registration.response';
import { ClientSecretResponse } from './dto/responses/client-secret.response';
import { RegisterClientCommand } from '@src/core/application/use-cases/client/commands/register-client.command';
import { RegenerateClientSecretCommand } from '@src/core/application/use-cases/client/commands/regenerate-client-secret.command';

@Controller('clients')
export class ClientController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async createClient(
    @Body() request: CreateClientRequest,
  ): Promise<ClientRegistrationResponse> {
    const command = new RegisterClientCommand(
      request.name,
      [], // Empty redirect URIs for client_credentials
      undefined, // No owner for public registration
      request.description,
      ['CLIENT_CREDENTIALS'], // Default grant type
      undefined, // No scope
      undefined, // No website URL
      undefined, // No logo URL
      undefined, // No contacts
    );

    const { client, plainSecret } = await this.commandBus.execute(command);

    return ClientRegistrationResponse.fromEntity(client, plainSecret);
  }

  @Get()
  async getClients(): Promise<ClientListResponse> {
    const query = new GetUserClientsQuery();
    const clients = await this.queryBus.execute(query);

    return ClientListResponse.fromClients(clients);
  }

  @Get('by-client-id/:clientId')
  async getClientByClientId(
    @Param('clientId') clientId: string,
  ): Promise<ClientDetailsResponse> {
    const query = new GetClientByClientIdQuery(clientId);
    const client = await this.queryBus.execute(query);

    return ClientDetailsResponse.fromEntity(client);
  }

  @Get(':id')
  async getClient(@Param('id') id: string): Promise<ClientDetailsResponse> {
    const query = new GetClientQuery(id);
    const client = await this.queryBus.execute(query);

    return ClientDetailsResponse.fromEntity(client);
  }

  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateDto: UpdateClientRequest,
  ): Promise<ClientDetailsResponse> {
    const command = new UpdateClientCommand(id, updateDto, undefined);
    const client = await this.commandBus.execute(command);

    return ClientDetailsResponse.fromEntity(client);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteClient(@Param('id') id: string): Promise<void> {
    const command = new DeleteClientCommand(id);
    await this.commandBus.execute(command);
  }

  @Post(':id/regenerate-secret')
  async regenerateClientSecret(
    @Param('id') id: string,
  ): Promise<ClientSecretResponse> {
    const command = new RegenerateClientSecretCommand(id);
    const { client, plainSecret } = await this.commandBus.execute(command);

    return ClientSecretResponse.fromEntity(client, plainSecret);
  }
}

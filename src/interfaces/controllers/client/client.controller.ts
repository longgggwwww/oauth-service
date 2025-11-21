// src/interfaces/controllers/client/client.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  Post,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetUserClientsQuery } from '@src/core/application/use-cases/client/queries/get-user-clients.query';
import { GetClientQuery } from '@src/core/application/use-cases/client/queries/get-client.query';
import { UpdateClientCommand } from '@src/core/application/use-cases/client/commands/update-client.command';
import { DeleteClientCommand } from '@src/core/application/use-cases/client/commands/delete-client.command';
import { ClientListResponse } from './dto/responses/client-list.response';
import { ClientDetailsResponse } from './dto/responses/client-details.response';
import { UpdateClientRequest } from './dto/requests/update-client.request';
import { ClientSummary } from '@src/core/shared/types';
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import { CreateClientRequest } from './dto/requests/create-client.request';
import { ClientRegistrationResponse } from './dto/responses/client-registration.response';
import { RegisterClientCommand } from '@src/core/application/use-cases/client/commands/register-client.command';

@Controller('clients')
// @UseGuards(JwtAuthGuard) // TODO: Implement guard
export class ClientController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) { }

  @Post()
  async createClient(@Body() request: CreateClientRequest): Promise<ClientRegistrationResponse> {
    const command = new RegisterClientCommand(
      request.name,
      request.redirectUris,
      request.description,
      request.grantTypes,
      request.scope,
      request.websiteUrl,
      request.logoUrl,
      request.contacts,
    );

    const { client, plainSecret } = await this.commandBus.execute(command);

    return {
      id: client.id,
      clientId: client.clientId,
      clientSecret: plainSecret,
      name: client.appName,
      redirectUris: client.redirectUris,
      createdAt: client.createdAt,
    };
  }

  @Get()
  async getClients(/* @CurrentUser() user: User */): Promise<ClientListResponse> {
    // TODO: Get user from guard
    const userId = 'dummy-user-id'; // Replace with actual user extraction

    const query = new GetUserClientsQuery(userId);
    const clients = await this.queryBus.execute(query);

    return ClientListResponse.fromClients(clients);
  }

  @Get(':id')
  async getClient(
    @Param('id') id: string,
    /* @CurrentUser() user: User */
  ): Promise<ClientDetailsResponse> {
    // TODO: Get user from guard
    const userId = 'dummy-user-id'; // Replace with actual user extraction

    const query = new GetClientQuery(id, userId);
    const client = await this.queryBus.execute(query);

    return ClientDetailsResponse.fromEntity(client);
  }

  @Put(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateDto: UpdateClientRequest,
    /* @CurrentUser() user: User */
  ): Promise<ClientDetailsResponse> {
    // TODO: Get user from guard
    const userId = 'dummy-user-id'; // Replace with actual user extraction

    const command = new UpdateClientCommand(id, userId, updateDto);
    const client = await this.commandBus.execute(command);

    return ClientDetailsResponse.fromEntity(client);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteClient(
    @Param('id') id: string,
    /* @CurrentUser() user: User */
  ): Promise<void> {
    // TODO: Get user from guard
    const userId = 'dummy-user-id'; // Replace with actual user extraction

    const command = new DeleteClientCommand(id, userId);
    await this.commandBus.execute(command);
  }
}

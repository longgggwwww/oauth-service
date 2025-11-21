// src/core/application/use-cases/client/queries/handlers/get-user-clients.handler.ts
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserClientsQuery } from '../get-user-clients.query';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import type { ClientSummary } from '@src/core/shared/types';

@QueryHandler(GetUserClientsQuery)
export class GetUserClientsHandler
  implements IQueryHandler<GetUserClientsQuery> {
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) { }

  async execute(query: GetUserClientsQuery): Promise<ClientSummary[]> {
    // TODO: In the new schema, ClientApp doesn't have a direct userId relationship
    // This needs to be refactored based on actual requirements:
    // Option 1: Track client ownership separately
    // Option 2: Use authorities/permissions system
    // Option 3: Allow all users to see all clients (if that's the design)

    // For now, returning empty array to avoid compilation error
    return [];

    // Original implementation that needs refactoring:
    // const clients = await this.clientRepository.findByUserId(query.userId);
    // return clients.map((client) => ({
    //   id: client.id,
    //   clientId: client.clientId,
    //   name: client.appName,
    //   redirectUris: client.redirectUris,
    //   createdAt: client.createdAt,
    //   updatedAt: client.updatedAt,
    // }));
  }
}

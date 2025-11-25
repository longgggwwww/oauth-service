// src/core/application/use-cases/client/queries/handlers/get-user-clients.handler.ts
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserClientsQuery } from '../get-user-clients.query';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import type { ClientSummary } from '@src/core/shared/types';

@QueryHandler(GetUserClientsQuery)
export class GetUserClientsHandler
  implements IQueryHandler<GetUserClientsQuery>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) {}

  async execute(query: GetUserClientsQuery): Promise<ClientSummary[]> {
    const clients = query.userId
      ? await this.clientRepository.findByOwnerId(query.userId)
      : await this.clientRepository.findAll();
    return clients.map((client) => ({
      id: client.id,
      clientId: client.clientId,
      name: client.appName,
      redirectUris: client.redirectUris,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));
  }
}

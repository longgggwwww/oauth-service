// src/core/application/use-cases/client/queries/handlers/get-user-clients.handler.ts
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserClientsQuery } from '../get-user-clients.query';
import type { ClientRepositoryPort } from '../../../../ports/repositories/client-repository.port';
import type { ClientSummary } from '../../../../../shared/types';

@QueryHandler(GetUserClientsQuery)
export class GetUserClientsHandler
  implements IQueryHandler<GetUserClientsQuery>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) {}

  async execute(query: GetUserClientsQuery): Promise<ClientSummary[]> {
    const clients = await this.clientRepository.findByUserId(query.userId);

    return clients.map((client) => ({
      id: client.id,
      clientId: client.clientId,
      name: client.name,
      redirectUris: client.redirectUris,
      scope: client.scope,
      websiteUrl: client.websiteUrl,
      logoUrl: client.logoUrl,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));
  }
}

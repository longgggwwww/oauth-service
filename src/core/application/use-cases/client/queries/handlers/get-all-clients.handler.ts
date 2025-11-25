// src/core/application/use-cases/client/queries/handlers/get-all-clients.handler.ts
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllClientsQuery } from '../get-all-clients.query';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import type { ClientSummary } from '@src/core/shared/types';

@QueryHandler(GetAllClientsQuery)
export class GetAllClientsHandler implements IQueryHandler<GetAllClientsQuery> {
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) {}

  async execute(query: GetAllClientsQuery): Promise<ClientSummary[]> {
    const clients = await this.clientRepository.findAll();

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

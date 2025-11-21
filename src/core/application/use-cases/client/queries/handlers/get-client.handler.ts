// src/core/application/use-cases/client/queries/handlers/get-client.handler.ts
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetClientQuery } from '../get-client.query';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import { ClientNotFoundException } from '@src/core/domain/exceptions/domain.exception';

@QueryHandler(GetClientQuery)
export class GetClientHandler implements IQueryHandler<GetClientQuery> {
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) { }

  async execute(query: GetClientQuery): Promise<ClientAppEntity> {
    const client = await this.clientRepository.findById(query.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    return client;
  }
}

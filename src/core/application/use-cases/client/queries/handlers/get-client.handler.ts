// src/core/application/use-cases/client/queries/handlers/get-client.handler.ts
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetClientQuery } from '../get-client.query';
import type { ClientRepositoryPort } from '../../../../ports/repositories/client-repository.port';
import { ClientEntity } from '../../../../../domain/entities/client.entity';
import { ClientNotFoundException } from '../../../../../domain/exceptions/domain.exception';

@QueryHandler(GetClientQuery)
export class GetClientHandler implements IQueryHandler<GetClientQuery> {
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) {}

  async execute(query: GetClientQuery): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(query.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    if (client.userId !== query.userId) {
      throw new ClientNotFoundException(); // Don't reveal existence to non-owners
    }

    return client;
  }
}

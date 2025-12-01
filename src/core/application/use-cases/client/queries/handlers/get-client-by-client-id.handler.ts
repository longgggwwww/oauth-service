// src/core/application/use-cases/client/queries/handlers/get-client-by-client-id.handler.ts
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetClientByClientIdQuery } from '../get-client-by-client-id.query';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import { ClientNotFoundException } from '@src/core/domain/exceptions/domain.exception';

@QueryHandler(GetClientByClientIdQuery)
export class GetClientByClientIdHandler
  implements IQueryHandler<GetClientByClientIdQuery>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) {}

  async execute(query: GetClientByClientIdQuery): Promise<ClientAppEntity> {
    const client = await this.clientRepository.findByClientId(query.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    return client;
  }
}

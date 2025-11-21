// src/core/application/use-cases/client/commands/handlers/update-client.handler.ts
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClientCommand } from '../update-client.command';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import { ClientNotFoundException } from '@src/core/domain/exceptions/domain.exception';

@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler
  implements ICommandHandler<UpdateClientCommand> {
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) { }

  async execute(command: UpdateClientCommand): Promise<ClientAppEntity> {
    const client = await this.clientRepository.findById(command.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    // Update client properties
    if (command.updateDto.name !== undefined) {
      client.appName = command.updateDto.name;
    }
    if (command.updateDto.redirectUris !== undefined) {
      client.redirectUris = command.updateDto.redirectUris;
    }

    client.updatedAt = new Date();

    return await this.clientRepository.save(client);
  }
}

// src/core/application/use-cases/client/commands/handlers/update-client.handler.ts
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClientCommand } from '../update-client.command';
import type { ClientRepositoryPort } from '../../../../ports/repositories/client-repository.port';
import { ClientEntity } from '../../../../../domain/entities/client.entity';
import { ClientNotFoundException } from '../../../../../domain/exceptions/domain.exception';

@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler
  implements ICommandHandler<UpdateClientCommand>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
  ) {}

  async execute(command: UpdateClientCommand): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(command.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    if (client.userId !== command.userId) {
      throw new ClientNotFoundException(); // Don't reveal existence to non-owners
    }

    // Update client properties
    if (command.updateDto.name !== undefined) {
      client.name = command.updateDto.name;
    }
    if (command.updateDto.redirectUris !== undefined) {
      client.redirectUris = command.updateDto.redirectUris;
    }
    if (command.updateDto.scope !== undefined) {
      client.scope = command.updateDto.scope;
    }
    if (command.updateDto.websiteUrl !== undefined) {
      client.websiteUrl = command.updateDto.websiteUrl;
    }
    if (command.updateDto.logoUrl !== undefined) {
      client.logoUrl = command.updateDto.logoUrl;
    }

    client.updatedAt = new Date();

    return await this.clientRepository.update(client);
  }
}

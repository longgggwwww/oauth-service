// src/core/application/use-cases/client/commands/handlers/delete-client.handler.ts
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteClientCommand } from '../delete-client.command';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import type { TokenRepositoryPort } from '@src/core/application/ports/repositories/token-repository.port';
import { ClientNotFoundException } from '@src/core/domain/exceptions/domain.exception';

@CommandHandler(DeleteClientCommand)
export class DeleteClientHandler
  implements ICommandHandler<DeleteClientCommand> {
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
    @Inject('TokenRepositoryPort')
    private readonly tokenRepository: TokenRepositoryPort,
  ) { }

  async execute(command: DeleteClientCommand): Promise<void> {
    const client = await this.clientRepository.findById(command.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    // TODO: Add authorization check - verify requesting user has permission to delete this client
    // This could be done via client authorities or a separate permission system

    // Revoke all tokens for this client
    await this.tokenRepository.revokeAllClientTokens(command.clientId);

    // Delete the client by ID (not clientId)
    await this.clientRepository.delete(client.id);
  }
}

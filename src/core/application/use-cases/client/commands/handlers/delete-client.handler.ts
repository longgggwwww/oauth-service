// src/core/application/use-cases/client/commands/handlers/delete-client.handler.ts
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteClientCommand } from '../delete-client.command';
import type { ClientRepositoryPort } from '../../../../ports/repositories/client-repository.port';
import type { TokenRepositoryPort } from '../../../../ports/repositories/token-repository.port';
import { ClientNotFoundException } from '../../../../../domain/exceptions/domain.exception';

@CommandHandler(DeleteClientCommand)
export class DeleteClientHandler
  implements ICommandHandler<DeleteClientCommand>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
    @Inject('TokenRepositoryPort')
    private readonly tokenRepository: TokenRepositoryPort,
  ) {}

  async execute(command: DeleteClientCommand): Promise<void> {
    const client = await this.clientRepository.findById(command.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    if (client.userId !== command.userId) {
      throw new ClientNotFoundException(); // Don't reveal existence to non-owners
    }

    // Revoke all tokens for this client
    await this.tokenRepository.revokeAllClientTokens(command.clientId);

    // Delete the client
    await this.clientRepository.delete(command.clientId);
  }
}

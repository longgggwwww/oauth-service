// src/core/application/use-cases/client/commands/handlers/delete-many-clients.handler.ts
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteManyClientsCommand } from '../delete-many-clients.command';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import type { TokenRepositoryPort } from '@src/core/application/ports/repositories/token-repository.port';

@CommandHandler(DeleteManyClientsCommand)
export class DeleteManyClientsHandler
  implements ICommandHandler<DeleteManyClientsCommand>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepository: ClientRepositoryPort,
    @Inject('TokenRepositoryPort')
    private readonly tokenRepository: TokenRepositoryPort,
  ) {}

  async execute(command: DeleteManyClientsCommand): Promise<{ deletedCount: number }> {
    const { clientIds, userId } = command;

    // Validate and filter clients
    const clientsToDelete: string[] = [];

    for (const id of clientIds) {
      const client = await this.clientRepository.findById(id);

      if (!client) {
        // Skip non-existent clients
        continue;
      }

      // Authorization check - verify requesting user owns this client (skip if no userId provided)
      if (userId && client.ownerId !== userId) {
        // Skip clients that the user doesn't own
        continue;
      }

      clientsToDelete.push(client.id);

      // Revoke all tokens for this client
      await this.tokenRepository.revokeAllClientTokens(id);
    }

    // Delete all valid clients
    if (clientsToDelete.length > 0) {
      await this.clientRepository.deleteMany(clientsToDelete);
    }

    return { deletedCount: clientsToDelete.length };
  }
}

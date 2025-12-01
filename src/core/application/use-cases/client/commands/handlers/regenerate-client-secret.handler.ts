import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegenerateClientSecretCommand } from '../regenerate-client-secret.command';
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import type { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { ClientNotFoundException } from '@src/core/domain/exceptions/domain.exception';

@CommandHandler(RegenerateClientSecretCommand)
export class RegenerateClientSecretHandler
  implements ICommandHandler<RegenerateClientSecretCommand>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepo: ClientRepositoryPort,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(
    command: RegenerateClientSecretCommand,
  ): Promise<{ client: ClientAppEntity; plainSecret: string }> {
    // Find existing client
    const client = await this.clientRepo.findById(command.clientId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    // Generate new secret
    const plainSecret = this.cryptoService.generateClientSecret();
    const hashedSecret = await this.cryptoService.hashSecret(plainSecret);

    // Update client with new secret
    client.updateSecret(hashedSecret);

    // Save updated client
    const savedClient = await this.clientRepo.save(client);

    return { client: savedClient, plainSecret };
  }
}

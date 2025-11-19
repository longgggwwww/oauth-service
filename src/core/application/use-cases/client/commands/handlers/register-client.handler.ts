import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterClientCommand } from '../register-client.command';
import { ClientEntity } from '../../../../../domain/entities/client.entity';
import type { ClientRepositoryPort } from '../../../../../application/ports/repositories/client-repository.port';
import type { UserRepositoryPort } from '../../../../../application/ports/repositories/user-repository.port';
import { CryptoService } from '../../../../../application/services/crypto.service';

@CommandHandler(RegisterClientCommand)
export class RegisterClientHandler
  implements ICommandHandler<RegisterClientCommand>
{
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepo: ClientRepositoryPort,
    @Inject('UserRepositoryPort') private readonly userRepo: UserRepositoryPort,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: RegisterClientCommand): Promise<ClientEntity> {
    // Find user
    // const user = await this.userRepo.findById(command.userId);
    // if (!user) {
    //   throw new Error('User not found');
    // }

    // // Validate user permissions (assume active users can register clients)
    // if (!user.active) {
    //   throw new Error('User is not active');
    // }

    // Check if clientId already exists
    const existingClient = await this.clientRepo.findByClientId(
      command.clientId,
    );
    if (existingClient) {
      throw new Error('Client ID already exists');
    }

    // Generate client secret
    const clientSecret = this.cryptoService.generateClientSecret();

    // Create client entity
    const client = ClientEntity.create(
      command.clientId,
      clientSecret,
      command.name,
      command.redirectUris,
      command.userId,
      command.description,
      command.grantTypes,
      command.scope,
      command.websiteUrl,
      command.logoUrl,
      command.contacts,
    );

    // Save client
    const savedClient = await this.clientRepo.save(client);

    // TODO: Create and publish ClientRegisteredEvent if needed

    return savedClient;
  }
}

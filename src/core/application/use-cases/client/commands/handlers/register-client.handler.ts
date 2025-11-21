import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterClientCommand } from '../register-client.command';
import { ClientAppEntity, ClientRole, GrantType } from '../../../../../domain/entities/client.entity';
import type { ClientRepositoryPort } from '../../../../../application/ports/repositories/client-repository.port';
import { CryptoService } from '../../../../../application/services/crypto.service';

@CommandHandler(RegisterClientCommand)
export class RegisterClientHandler
  implements ICommandHandler<RegisterClientCommand> {
  constructor(
    @Inject('ClientRepositoryPort')
    private readonly clientRepo: ClientRepositoryPort,
    private readonly cryptoService: CryptoService,
  ) { }

  async execute(command: RegisterClientCommand): Promise<{ client: ClientAppEntity; plainSecret: string }> {
    try {
      console.log('[RegisterClientHandler] Starting client registration:', command.name);

      // Generate client ID and secret
      const clientId = this.cryptoService.generateClientId();
      const plainSecret = this.cryptoService.generateClientSecret();
      const hashedSecret = await this.cryptoService.hashSecret(plainSecret);

      console.log('[RegisterClientHandler] Generated clientId:', clientId);

      // Check if clientId already exists (highly unlikely with UUID but good practice)
      const existingClient = await this.clientRepo.findByClientId(clientId);
      if (existingClient) {
        throw new Error('Client ID collision, please try again');
      }

      // Map grant types with proper defaults
      const grantTypes = command.grantTypes && command.grantTypes.length > 0
        ? command.grantTypes.map(gt => gt.toUpperCase()).filter(gt => Object.values(GrantType).includes(gt as GrantType)) as GrantType[]
        : [GrantType.AUTHORIZATION_CODE];

      console.log('[RegisterClientHandler] Grant types:', grantTypes);

      // Create client entity with HASHED secret
      const client = ClientAppEntity.create(
        clientId,
        hashedSecret,
        command.name,
        command.redirectUris,
        grantTypes,
        ClientRole.THIRD_PARTY_APP,
        [], // authorities - can be extended via command if needed
        command.description,
      );

      console.log('[RegisterClientHandler] Saving client to database...');

      // Save client
      const savedClient = await this.clientRepo.save(client);

      console.log('[RegisterClientHandler] Client saved successfully:', savedClient.clientId);

      // TODO: Create and publish ClientRegisteredEvent if needed

      return { client: savedClient, plainSecret };
    } catch (error) {
      console.error('[RegisterClientHandler] Error during registration:', error);
      throw error;
    }
  }
}

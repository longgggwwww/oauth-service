import { Injectable } from '@nestjs/common';
import { TokenRepositoryPort } from '../../../../core/application/ports/repositories/token-repository.port';

@Injectable()
export class CachedTokenRepository implements TokenRepositoryPort {
  async revokeAllClientTokens(clientId: string): Promise<void> {
    // TODO: Implement token revocation logic
    // This would typically involve finding all tokens for the client and marking them as revoked
    console.log(`Revoking all tokens for client ${clientId}`);
  }
}

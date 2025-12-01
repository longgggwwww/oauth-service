import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokeTokenCommand } from '../revoke-token.command';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { RefreshTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/refresh-token.repository';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { TokenService } from '@src/core/application/services/token.service';

/**
 * RevokeTokenHandler
 * Handles OAuth 2.0 Token Revocation (RFC 7009)
 *
 * This handler supports revoking both access tokens and refresh tokens.
 * Per RFC 7009, the revocation endpoint should:
 * - Return 200 OK even if the token was already revoked or invalid
 * - Authenticate the client before revoking
 * - Revoke the specified token and optionally associated tokens
 */
@Injectable()
@CommandHandler(RevokeTokenCommand)
export class RevokeTokenHandler implements ICommandHandler<RevokeTokenCommand> {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: RevokeTokenCommand): Promise<boolean> {
    const { request } = command;
    const { token, token_type_hint, client_id, client_secret } = request;

    // Validate client credentials
    const client = await this.clientRepository.findByClientId(client_id);
    if (!client) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    // Verify client secret if provided (for confidential clients)
    if (client_secret) {
      const isValid = await this.cryptoService.verifySecret(
        client_secret,
        client.clientSecret,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid client credentials');
      }
    }

    // Try to revoke based on token_type_hint or try both
    let revoked = false;
    if (token_type_hint === 'refresh_token') {
      revoked = await this.revokeRefreshToken(token, client.id);
    } else if (token_type_hint === 'access_token') {
      revoked = await this.revokeAccessToken(token, client.id);
    } else {
      // No hint provided, try refresh token first (more common), then access token
      const revokedRefresh = await this.revokeRefreshToken(token, client.id);
      if (revokedRefresh) {
        revoked = true;
      } else {
        revoked = await this.revokeAccessToken(token, client.id);
      }
    }

    // Return whether we actually found and revoked anything. Controllers can
    // use this to decide whether to return 204 No Content or 200 with a body.
    return revoked;
  }

  /**
   * Revoke a refresh token
   * Returns true if token was found and revoked
   */
  private async revokeRefreshToken(
    token: string,
    clientId: string,
  ): Promise<boolean> {
    try {
      // Find the refresh token in database
      const storedToken = await this.refreshTokenRepository.findByToken(token);

      if (!storedToken) {
        return false;
      }

      // Verify token belongs to the requesting client
      if (storedToken.clientId !== clientId) {
        // Per RFC 7009: Don't reveal that the token exists but belongs to another client
        return false;
      }

      // Revoke the token
      await this.refreshTokenRepository.revoke(storedToken.id);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Revoke an access token
   * Note: Since access tokens are JWTs and stateless, we can only:
   * 1. Verify the token is valid and belongs to the client
   * 2. Optionally revoke associated refresh tokens
   *
   * For true access token revocation, you would need:
   * - A token blacklist (Redis/DB)
   * - Or short expiration times with refresh token rotation
   */
  private async revokeAccessToken(
    token: string,
    clientId: string,
  ): Promise<boolean> {
    try {
      // Decode the access token (don't verify expiration since we want to revoke expired tokens too)
      const payload = this.tokenService.decodeToken(token);

      if (!payload) {
        return false;
      }

      // Verify the token was issued for this client
      const client = await this.clientRepository.findById(clientId);
      if (!client || payload.clientId !== client.clientId) {
        return false;
      }

      // For access tokens, we revoke all associated refresh tokens for the user/client combination
      // This effectively invalidates the session
      if (payload.sub) {
        // User token - revoke all refresh tokens for this user on this client
        await this.refreshTokenRepository.revokeByUserAndClient(
          payload.sub,
          clientId,
        );
      } else {
        // Client credentials token - revoke all refresh tokens for this client
        await this.refreshTokenRepository.revokeAllForClient(clientId);
      }

      return true;
    } catch {
      return false;
    }
  }
}

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExchangeTokenCommand } from '../exchange-token.command';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { RefreshTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/refresh-token.repository';
import { AuthorizationCodeRepository } from '@src/infrastructure/persistence/prisma/repositories/authorization-code.repository';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { TokenService } from '@src/core/application/services/token.service';
import type { UserRepositoryPort } from '@src/core/application/ports/repositories/user-repository.port';
import { GrantType } from '@src/core/domain/entities/client.entity';

@Injectable()
@CommandHandler(ExchangeTokenCommand)
export class ExchangeTokenHandler
  implements ICommandHandler<ExchangeTokenCommand>
{
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
    private readonly authorizationCodeRepository: AuthorizationCodeRepository,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: ExchangeTokenCommand): Promise<any> {
    const { request } = command;

    // Validate client credentials
    const client = await this.clientRepository.findByClientId(
      request.client_id,
    );
    if (!client) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    // Verify client secret if provided
    if (request.client_secret) {
      const isValid = await this.cryptoService.verifySecret(
        request.client_secret,
        client.clientSecret,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid client credentials');
      }
    }

    // Route to appropriate grant type handler
    switch (request.grant_type) {
      case 'client_credentials':
        return this.handleClientCredentials(client);
      case 'refresh_token':
        return this.handleRefreshToken(request.refresh_token!, client);
      case 'authorization_code':
        return this.handleAuthorizationCode(request, client);
      default:
        throw new BadRequestException(
          `Unsupported grant type: ${request.grant_type}`,
        );
    }
  }

  /**
   * Client Credentials Flow
   * For M2M authentication - no user involved
   */
  private async handleClientCredentials(client: any): Promise<any> {
    // Check if client supports this grant type
    if (!client.allowedGrantTypes.includes(GrantType.CLIENT_CREDENTIALS)) {
      throw new UnauthorizedException(
        'Client not authorized for client_credentials grant type',
      );
    }

    // Generate tokens with client info (no userId)
    const payload = {
      clientId: client.clientId,
      authorities: client.authorities,
      type: 'client_credentials' as const,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    // Save refresh token to database with userId = null
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepository.save({
      token: refreshToken,
      clientId: client.id,
      userId: null, // No user for client credentials
      scopes: client.authorities,
      expiresAt,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900, // 15 minutes in seconds
      scope: client.authorities.join(' '),
    };
  }

  /**
   * Refresh Token Flow
   * Exchange refresh token for new access token
   */
  private async handleRefreshToken(
    refreshTokenStr: string,
    client: any,
  ): Promise<any> {
    if (!refreshTokenStr) {
      throw new BadRequestException('refresh_token is required');
    }

    // Verify refresh token signature
    const payload = this.tokenService.verifyRefreshToken(refreshTokenStr);

    // Find refresh token in database
    const storedToken =
      await this.refreshTokenRepository.findByToken(refreshTokenStr);
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is revoked
    if (storedToken.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Check if token belongs to this client
    if (storedToken.clientId !== client.id) {
      throw new UnauthorizedException('Token does not belong to this client');
    }

    // Generate new access token with same payload
    const newAccessToken = this.tokenService.generateAccessToken({
      sub: payload.sub,
      email: payload.email,
      clientId: payload.clientId,
      authorities: payload.authorities,
      type: payload.type,
    });

    return {
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: 900,
      scope: storedToken.scopes.join(' '),
    };
  }

  /**
   * Authorization Code Flow
   */
  private async handleAuthorizationCode(
    request: any,
    client: any,
  ): Promise<any> {
    const code = request.code;
    if (!code) throw new BadRequestException('code is required');

    const authCode = await this.authorizationCodeRepository.findByCode(code);
    if (!authCode)
      throw new UnauthorizedException('Invalid authorization code');

    // Check expiry
    if (new Date() > new Date(authCode.expiresAt)) {
      // Remove the code if expired
      await this.authorizationCodeRepository.deleteById(authCode.id);
      throw new UnauthorizedException('Authorization code expired');
    }

    // Ensure code belongs to the client performing the exchange
    if (authCode.clientId !== client.id) {
      throw new UnauthorizedException(
        'Authorization code was not issued to this client',
      );
    }

    // Validate redirect_uri if provided - must match one of client's registered URIs
    if (request.redirect_uri) {
      const match =
        client.redirectUris &&
        client.redirectUris.includes(request.redirect_uri);
      if (!match) {
        throw new BadRequestException(
          'redirect_uri does not match registered client redirect URIs',
        );
      }
    }

    // PKCE verification: stored challenge compared against code_verifier
    if (authCode.codeChallenge) {
      const verifier = request.code_verifier;
      if (!verifier) {
        throw new BadRequestException(
          'code_verifier is required for this authorization code',
        );
      }

      const sha256 = (input: string) =>
        require('crypto').createHash('sha256').update(input).digest();

      const base64url = (b: Buffer) =>
        b
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

      const computed = base64url(sha256(verifier));

      // Accept either S256-derived match or plain match (to support plain challenge)
      if (
        !(
          computed === authCode.codeChallenge ||
          verifier === authCode.codeChallenge
        )
      ) {
        throw new UnauthorizedException('Invalid code_verifier');
      }
    }

    // Lookup user for token payload (optional fields like email)
    let userEmail: string | undefined = undefined;
    try {
      const user = await this.userRepository.findById(authCode.userId);
      if (user) userEmail = user.email;
    } catch {
      // non-fatal; continue without email
    }

    // Prepare token payload
    const accessPayload: any = {
      sub: authCode.userId,
      clientId: client.clientId,
      authorities: client.authorities,
      type: 'user' as const,
    };
    if (userEmail) accessPayload.email = userEmail;

    const accessToken = this.tokenService.generateAccessToken(accessPayload);
    const refreshToken = this.tokenService.generateRefreshToken(accessPayload);

    // Persist refresh token
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    await this.refreshTokenRepository.save({
      token: refreshToken,
      clientId: client.id,
      userId: authCode.userId,
      scopes: authCode.scopes,
      expiresAt: refreshExpiresAt,
    });

    // Consume authorization code (single use)
    await this.authorizationCodeRepository.deleteById(authCode.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900,
      scope: authCode.scopes.join(' '),
    };
  }
}

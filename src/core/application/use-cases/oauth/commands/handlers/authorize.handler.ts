import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthorizeCommand } from '../authorize.command';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { AuthorizationCodeRepository } from '@src/infrastructure/persistence/prisma/repositories/authorization-code.repository';
import { ScopeRepository } from '@src/infrastructure/persistence/prisma/repositories/scope.repository';

@Injectable()
@CommandHandler(AuthorizeCommand)
export class AuthorizeHandler implements ICommandHandler<AuthorizeCommand> {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly authorizationCodeRepository: AuthorizationCodeRepository,
    private readonly scopeRepository: ScopeRepository,
  ) {}

  async execute(command: AuthorizeCommand): Promise<any> {
    const { request, userId } = command;

    // Validate client
    const client = await this.clientRepository.findByClientId(
      request.client_id,
    );
    if (!client) throw new BadRequestException('invalid_client');

    // Validate redirect_uri
    if (
      !client.redirectUris ||
      !client.redirectUris.includes(request.redirect_uri)
    ) {
      throw new BadRequestException('invalid_redirect_uri');
    }

    // Parse scopes
    const requested = request.scope
      ? request.scope.split(/\s+/).filter(Boolean)
      : [];

    // Validate requested scopes against registered scopes (only include known scopes)
    const scopeRecords = await this.scopeRepository.findByNames(requested);
    const scopeIds = scopeRecords.map((s) => s.id);
    const scopeNames = scopeRecords.map((s) => s.name);

    // Must have a logged-in user for authorization code flow
    if (!userId) {
      // In a full implementation we'd redirect to login. For now return an object indicating this.
      return {
        login_required: true,
        redirect_to_login: `/login?client_id=${encodeURIComponent(request.client_id)}&redirect_uri=${encodeURIComponent(request.redirect_uri)}`,
      };
    }

    // Generate authorization code
    const crypto = require('crypto');
    const code = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save authorization code and link scopes
    await this.authorizationCodeRepository.save({
      code,
      clientId: client.id,
      userId,
      sessionId: undefined,
      scopeIds: scopeIds.length ? scopeIds : undefined,
      codeChallenge: request.code_challenge || '',
      expiresAt,
    });

    // Build redirect URI with code and state
    const sep = request.redirect_uri.includes('?') ? '&' : '?';
    let redirect = `${request.redirect_uri}${sep}code=${encodeURIComponent(code)}`;
    if (request.state)
      redirect += `&state=${encodeURIComponent(request.state)}`;

    return { redirectUri: redirect, scopes: scopeNames };
  }
}

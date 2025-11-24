import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticateCommand } from '../authenticate.command';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { PasswordCredentialRepository } from '@src/infrastructure/persistence/prisma/repositories/password-credential.repository';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { TokenService } from '@src/core/application/services/token.service';
import {
  InvalidCredentialsException,
  UserNotFoundException,
} from '@src/core/domain/exceptions/domain-exceptions';

@Injectable()
@CommandHandler(AuthenticateCommand)
export class AuthenticateHandler
  implements ICommandHandler<AuthenticateCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordCredentialRepository: PasswordCredentialRepository,
    private readonly clientRepository: ClientRepository,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: AuthenticateCommand): Promise<any> {
    const { email, password, clientId, clientSecret } = command;

    // 0. Validate Client
    if (clientId) {
      const client = await this.clientRepository.findByClientId(clientId);
      if (!client) {
        throw new NotFoundException(`Client with ID ${clientId} not found`);
      }

      if (clientSecret) {
        const isClientValid = await this.cryptoService.verifySecret(
          clientSecret,
          client.clientSecret,
        );
        if (!isClientValid) {
          throw new UnauthorizedException('Invalid client secret');
        }
      }
    }

    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }

    // 2. Get password credential
    const credential = await this.passwordCredentialRepository.findByUserId(
      user.id,
    );
    if (!credential) {
      // User exists but has no password set (maybe only social login or passkey)
      // For now, treat as invalid credentials or throw specific error
      throw new InvalidCredentialsException();
    }

    // 3. Verify password
    if (password) {
      const isValid = await this.cryptoService.verifySecret(
        password,
        credential.passwordHash,
      );
      if (!isValid) {
        throw new InvalidCredentialsException();
      }
    } else {
      // Handle case where password is not provided (e.g. if we supported other auth methods here)
      // But for this command, password is expected if mfaToken is not present (simplified for now)
      throw new InvalidCredentialsException();
    }

    // 3.a Ensure user has verified their email
    if (user.status === 'PENDING_VERIFICATION') {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email before logging in.',
      );
    }

    // 4. Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      clientId: clientId || 'unknown',
      type: 'user' as const,
    };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}

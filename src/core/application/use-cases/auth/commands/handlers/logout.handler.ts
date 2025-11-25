import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../logout.command';
import { RefreshTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/refresh-token.repository';
import { AuthSessionRepository } from '@src/infrastructure/persistence/prisma/repositories/auth-session.repository';

@Injectable()
@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  private readonly logger = new Logger(LogoutHandler.name);

  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authSessionRepository: AuthSessionRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { userId, sessionId } = command;

    this.logger.log(`Logging out user: ${userId}`);

    // 1. Revoke all refresh tokens for this user
    try {
      await this.refreshTokenRepository.revokeAllForUser(userId);
      this.logger.log(`Revoked all refresh tokens for user: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to revoke refresh tokens for user ${userId}: ${error.message}`,
        error.stack,
      );
      // Continue with logout even if this fails
    }

    // 2. Delete auth session if sessionId is provided
    if (sessionId) {
      try {
        await this.authSessionRepository.delete(sessionId);
        this.logger.log(`Deleted auth session: ${sessionId}`);
      } catch (error) {
        // Session might not exist, log but don't fail
        this.logger.warn(
          `Failed to delete auth session ${sessionId}: ${error.message}`,
        );
      }
    }

    // Note: Access tokens (JWT) cannot be revoked directly as they are stateless.
    // They will expire naturally based on their expiration time.
    // For stricter security, implement a token blacklist in Redis.

    this.logger.log(`User ${userId} logged out successfully`);
  }
}

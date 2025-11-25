import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '../verify-email.command';
import { EmailVerificationTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/email-verification-token.repository';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<any> {
    const { token } = command;

    // 1. Find token in database
    const verificationToken =
      await this.emailVerificationTokenRepository.findByToken(token);

    if (!verificationToken) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    // 2. Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      // Clean up expired token
      await this.emailVerificationTokenRepository.deleteByUserId(
        verificationToken.userId,
      );
      throw new BadRequestException(
        'Verification token has expired. Please request a new one.',
      );
    }

    // 3. Update user status to ACTIVE
    await this.userRepository.updateStatus(verificationToken.userId, 'ACTIVE');

    // 4. Delete all verification tokens for this user
    await this.emailVerificationTokenRepository.deleteByUserId(
      verificationToken.userId,
    );

    return {
      message: 'Email verified successfully. You can now login.',
    };
  }
}

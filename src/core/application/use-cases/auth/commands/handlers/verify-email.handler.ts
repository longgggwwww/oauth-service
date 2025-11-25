import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '../verify-email.command';
import { EmailVerificationTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/email-verification-token.repository';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { PrismaClient } from '@prisma/client';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<any> {
    const { token } = command;

    console.log(`[VerifyEmailHandler] Verifying email with token: ${token}`);

    // 1. Find token in database
    const verificationToken =
      await this.emailVerificationTokenRepository.findByToken(token);

    if (!verificationToken) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    console.log(
      `[VerifyEmailHandler] Token found for userId: ${verificationToken.userId}`,
    );

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
    console.log(
      `[VerifyEmailHandler] User status updated to ACTIVE for userId: ${verificationToken.userId}`,
    );

    // 4. Check if profile exists and log status
    const userWithProfile = await this.prisma.user.findUnique({
      where: { id: verificationToken.userId },
      include: {
        profile: true,
      },
    });

    if (!userWithProfile?.profile) {
      console.warn(
        `[VerifyEmailHandler] WARNING: No profile found for user: ${verificationToken.userId}`,
      );
    } else {
      console.log(
        `[VerifyEmailHandler] User profile verified for userId: ${verificationToken.userId}`,
        {
          profileId: userWithProfile.profile.id,
          fullName: userWithProfile.profile.fullName,
        },
      );
    }

    // 5. Delete all verification tokens for this user
    await this.emailVerificationTokenRepository.deleteByUserId(
      verificationToken.userId,
    );

    console.log(
      `[VerifyEmailHandler] Email verification completed successfully for userId: ${verificationToken.userId}`,
    );

    return {
      message: 'Email verified successfully. You can now login.',
      userId: verificationToken.userId,
      hasProfile: !!userWithProfile?.profile,
      profile: userWithProfile?.profile || null,
    };
  }
}

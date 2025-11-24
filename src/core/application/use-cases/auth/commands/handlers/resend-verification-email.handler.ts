import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendVerificationEmailCommand } from '../resend-verification-email.command';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { EmailVerificationTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/email-verification-token.repository';
import { EmailService } from '@src/core/application/services/email.service';
import { randomBytes } from 'crypto';

@Injectable()
@CommandHandler(ResendVerificationEmailCommand)
export class ResendVerificationEmailHandler implements ICommandHandler<ResendVerificationEmailCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
        private readonly emailService: EmailService,
    ) { }

    async execute(command: ResendVerificationEmailCommand): Promise<any> {
        const { email } = command;

        // 1. Find user by email
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. Check user status
        if (user.status !== 'PENDING_VERIFICATION') {
            throw new BadRequestException('Email is already verified');
        }

        // 3. Delete old verification tokens
        await this.emailVerificationTokenRepository.deleteByUserId(user.id);

        // 4. Generate new verification token
        const verificationToken = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

        await this.emailVerificationTokenRepository.create(
            user.id,
            verificationToken,
            expiresAt
        );

        // 5. Send verification email
        try {
            await this.emailService.sendVerificationEmail(email, verificationToken);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw new BadRequestException('Failed to send verification email. Please try again later.');
        }

        return {
            message: 'Verification email sent. Please check your inbox.',
        };
    }
}

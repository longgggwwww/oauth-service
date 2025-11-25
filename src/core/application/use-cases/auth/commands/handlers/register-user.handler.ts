import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register-user.command';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { PasswordCredentialRepository } from '@src/infrastructure/persistence/prisma/repositories/password-credential.repository';
import { EmailVerificationTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/email-verification-token.repository';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { EmailService } from '@src/core/application/services/email.service';
import { randomBytes } from 'crypto';

@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordCredentialRepository: PasswordCredentialRepository,
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<any> {
    const {
      email,
      password,
      phoneNumber,
      givenName,
      familyName,
      fullName,
      picture,
      avatarUrl,
      locale,
      timezone,
      birthDate,
    } = command;

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      // 1a. If user is already active or suspended, reject registration
      if (existingUser.status !== 'PENDING_VERIFICATION') {
        throw new ConflictException('User with this email already exists');
      }

      // 1b. If user is pending verification, allow re-registration
      // Update password if provided
      if (password) {
        const passwordHash = await this.cryptoService.hashSecret(password);

        // Update existing password credential
        const existingCredential =
          await this.passwordCredentialRepository.findByUserId(existingUser.id);
        if (existingCredential) {
          existingCredential.passwordHash = passwordHash;
          existingCredential.updatedAt = new Date();
          await this.passwordCredentialRepository.save(existingCredential);
        } else {
          // Create new credential if not exists
          await this.passwordCredentialRepository.create({
            userId: existingUser.id,
            passwordHash,
          });
        }
      }

      // Update profile if any profile fields provided
      if (
        givenName ||
        familyName ||
        fullName ||
        picture ||
        avatarUrl ||
        locale ||
        timezone ||
        birthDate
      ) {
        await this.userRepository.updateProfile(existingUser.id, {
          givenName,
          familyName,
          fullName,
          picture,
          avatarUrl,
          locale,
          timezone,
          birthDate,
        });
      }

      // Delete old verification tokens
      await this.emailVerificationTokenRepository.deleteByUserId(
        existingUser.id,
      );

      // Generate new verification token
      const verificationToken = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

      await this.emailVerificationTokenRepository.create(
        existingUser.id,
        verificationToken,
        expiresAt,
      );

      // Send verification email
      try {
        await this.emailService.sendVerificationEmail(
          email,
          verificationToken,
          givenName || fullName,
        );
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }

      return {
        message:
          'Registration email resent. Please check your email to verify your account.',
        email: existingUser.email,
      };
    }

    // 2. Validate required fields for new users
    if (!phoneNumber) {
      throw new BadRequestException('Phone number is required');
    }
    if (!fullName) {
      throw new BadRequestException('Full name is required');
    }
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    // 3. Hash password
    const passwordHash = await this.cryptoService.hashSecret(password);

    // 4. Create user with PENDING_VERIFICATION status
    const user = await this.userRepository.create({
      email,
      phoneNumber,
      status: 'PENDING_VERIFICATION',
    });

    // 5. Create password credential
    await this.passwordCredentialRepository.create({
      userId: user.id,
      passwordHash,
    });

    // 6. Create user profile with all provided fields
    if (
      givenName ||
      familyName ||
      fullName ||
      picture ||
      avatarUrl ||
      locale ||
      timezone ||
      birthDate
    ) {
      await this.userRepository.updateProfile(user.id, {
        givenName,
        familyName,
        fullName,
        picture,
        avatarUrl,
        locale,
        timezone,
        birthDate,
      });
    }

    // 7. Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    await this.emailVerificationTokenRepository.create(
      user.id,
      verificationToken,
      expiresAt,
    );

    // 8. Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        email,
        verificationToken,
        givenName || fullName,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email sends fails
      // User can request resend
    }

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      email: user.email,
    };
  }
}

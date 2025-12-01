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
import { PrismaClient, Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly prisma: PrismaClient,
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
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!fullName) {
      throw new BadRequestException('Full name is required');
    }
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    // 3. Hash password
    const passwordHash = await this.cryptoService.hashSecret(password);

    console.log(
      `[RegisterUserHandler] Starting new user registration for email: ${email}`,
    );

    // 4-7. Create user, password, profile, and verification token in a transaction
    let user: any;
    let verificationToken: string | undefined;

    // Attempt the creation in a small retry loop to handle rare token collisions
    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.prisma.$transaction(async (tx) => {
          // 4. Create user with PENDING_VERIFICATION status
          const newUser = await tx.user.create({
            data: {
              email,
              phoneNumber,
              status: 'PENDING_VERIFICATION',
            },
          });

          console.log(
            `[RegisterUserHandler] User created with id: ${newUser.id} (attempt ${attempt})`,
          );

          // 5. Create password credential
          await tx.passwordCredential.create({
            data: {
              userId: newUser.id,
              passwordHash,
            },
          });

          console.log(
            `[RegisterUserHandler] Password credential created for user: ${newUser.id}`,
          );

          // 6. Create user profile with all provided fields
          let profile: any = null;
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
            const birthDateValue = birthDate ? new Date(birthDate) : undefined;

            profile = await tx.userProfile.create({
              data: {
                userId: newUser.id,
                givenName,
                familyName,
                fullName,
                picture,
                avatarUrl,
                locale,
                timezone,
                birthDate: birthDateValue,
              },
            });

            console.log(
              `[RegisterUserHandler] User profile created with id: ${profile?.id} for user: ${newUser.id}`,
            );
          }

          // 7. Generate and store verification token
          const token = randomBytes(32).toString('hex');
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

          await tx.emailVerificationToken.create({
            data: {
              userId: newUser.id,
              token,
              expiresAt,
            },
          });

          console.log(
            `[RegisterUserHandler] Email verification token created for user: ${newUser.id}`,
          );

          return { user: newUser, token, profile };
        });

        user = result.user;
        verificationToken = result.token;

        console.log(
          `[RegisterUserHandler] Transaction completed successfully for user: ${user.id}`,
          {
            hasProfile: !!result.profile,
            profileId: result.profile?.id,
          },
        );

        // success — break out of retry loop
        lastError = null;
        break;
      } catch (error: unknown) {
        lastError = error;
        console.error(
          `[RegisterUserHandler] Transaction attempt ${attempt} failed:`,
          error,
        );

        // Inspect Prisma unique constraint error (P2002)
        const prismaErr = error as
          | Prisma.PrismaClientKnownRequestError
          | undefined;
        if (prismaErr && prismaErr.code === 'P2002') {
          const meta: any = (prismaErr as any).meta || {};
          const target = meta.target || meta.constraint || meta;
          // Normalize targets to array of strings
          const targets: string[] = Array.isArray(target)
            ? target.map(String)
            : typeof target === 'string'
              ? [target]
              : [];

          console.log(`[RegisterUserHandler] Prisma P2002 targets:`, targets);

          // If token collision (rare) -> retry
          const tokenCollision = targets.some((t) =>
            String(t).toLowerCase().includes('token'),
          );
          if (tokenCollision) {
            if (attempt < maxAttempts) {
              console.warn(
                `[RegisterUserHandler] Token collision detected; retrying (attempt ${attempt + 1}/${maxAttempts})`,
              );
              // continue to next attempt which will regenerate token
              continue;
            }

            // exhausted retries for token
            throw new BadRequestException(
              'Failed to generate a unique verification token. Please try again.',
            );
          }

          // Email collision -> conflict
          const emailCollision = targets.some((t) =>
            String(t).toLowerCase().includes('email'),
          );
          if (emailCollision) {
            throw new ConflictException('User with this email already exists');
          }

          // Phone collision -> conflict
          const phoneCollision = targets.some((t) =>
            String(t).toLowerCase().includes('phone'),
          );
          if (phoneCollision) {
            throw new ConflictException('Phone number already in use');
          }
        }

        // Non-P2002 or unclassified P2002 — surface generic failure
        throw new BadRequestException(
          'Failed to register user. Please try again.',
        );
      }
    }

    if (!user || !verificationToken) {
      // If we exited loop without creating user, rethrow last error if available
      if (lastError) {
        // If lastError is already an HttpException, throw as-is
        throw lastError as any;
      }

      throw new BadRequestException(
        'Failed to register user. Please try again.',
      );
    }

    // 8. Send verification email (outside transaction)
    try {
      await this.emailService.sendVerificationEmail(
        email,
        verificationToken,
        givenName || fullName,
      );
      console.log(`[RegisterUserHandler] Verification email sent to: ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email send fails
      // User can request resend
    }

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      email: user.email,
      userId: user.id, // Include userId for debugging
    };
  }
}

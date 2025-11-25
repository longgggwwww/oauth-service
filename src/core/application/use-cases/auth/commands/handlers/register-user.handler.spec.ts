import { BadRequestException, ConflictException } from '@nestjs/common';
import { RegisterUserHandler } from './register-user.handler';
import { RegisterUserCommand } from '../register-user.command';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { PasswordCredentialRepository } from '@src/infrastructure/persistence/prisma/repositories/password-credential.repository';
import { EmailVerificationTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/email-verification-token.repository';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { EmailService } from '@src/core/application/services/email.service';
import { randomBytes } from 'crypto';

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('testtoken')),
}));

describe('RegisterUserHandler - required fields validation', () => {
  let handler: RegisterUserHandler;
  const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateProfile: jest.fn(),
  } as any;
  const mockPasswordRepo = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as any;
  const mockEmailTokenRepo = {
    deleteByUserId: jest.fn(),
    create: jest.fn(),
  } as any;
  const mockCryptoService = {
    hashSecret: jest.fn().mockResolvedValue('hashed'),
  } as any;
  const mockEmailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepo.findByEmail.mockResolvedValue(null);
    handler = new RegisterUserHandler(
      mockUserRepo,
      mockPasswordRepo,
      mockEmailTokenRepo,
      mockCryptoService,
      mockEmailService,
    );
  });

  it('should throw BadRequestException when phoneNumber is missing', async () => {
    const command = new RegisterUserCommand(
      'test@example.com',
      undefined as any, // phoneNumber missing
      'John Doe',
      'password123',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when fullName is missing', async () => {
    const command = new RegisterUserCommand(
      'test@example.com',
      '1234567890',
      undefined as any, // fullName missing
      'password123',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when password is missing', async () => {
    const command = new RegisterUserCommand(
      'test@example.com',
      '1234567890',
      'John Doe',
      undefined as any, // password missing
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });
});

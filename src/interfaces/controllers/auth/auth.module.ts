import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthenticateHandler } from '@src/core/application/use-cases/auth/commands/handlers/authenticate.handler';
import { RegisterUserHandler } from '@src/core/application/use-cases/auth/commands/handlers/register-user.handler';
import { VerifyEmailHandler } from '@src/core/application/use-cases/auth/commands/handlers/verify-email.handler';
import { ResendVerificationEmailHandler } from '@src/core/application/use-cases/auth/commands/handlers/resend-verification-email.handler';
import { TokenService } from '@src/core/application/services/token.service';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { PrismaModule } from '@src/infrastructure/persistence/prisma/prisma.module';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { PasswordCredentialRepository } from '@src/infrastructure/persistence/prisma/repositories/password-credential.repository';
import { EmailVerificationTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/email-verification-token.repository';
import { EmailService } from '@src/core/application/services/email.service';

import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}), // Config is in TokenService for now, but good to have module
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthenticateHandler,
    RegisterUserHandler,
    VerifyEmailHandler,
    ResendVerificationEmailHandler,
    TokenService,
    CryptoService,
    UserRepository,
    PasswordCredentialRepository,
    EmailVerificationTokenRepository,
    EmailService,
    ClientRepository,
  ],
})
export class AuthModule {}

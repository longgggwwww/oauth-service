import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthenticateHandler } from '@src/core/application/use-cases/auth/commands/handlers/authenticate.handler';
import { RegisterUserHandler } from '@src/core/application/use-cases/auth/commands/handlers/register-user.handler';
import { TokenService } from '@src/core/application/services/token.service';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { PrismaModule } from '@src/infrastructure/persistence/prisma/prisma.module';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { PasswordCredentialRepository } from '@src/infrastructure/persistence/prisma/repositories/password-credential.repository';

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
        TokenService,
        CryptoService,
        UserRepository,
        PasswordCredentialRepository,
        ClientRepository,
    ],
})
export class AuthModule { }

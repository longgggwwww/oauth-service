import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@src/infrastructure/persistence/prisma/prisma.module';
import { OauthController } from './oauth.controller';
import { ExchangeTokenHandler } from '@src/core/application/use-cases/oauth/commands/handlers/exchange-token.handler';
import { AuthorizeHandler } from '@src/core/application/use-cases/oauth/commands/handlers/authorize.handler';
import { RevokeTokenHandler } from '@src/core/application/use-cases/oauth/commands/handlers/revoke-token.handler';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { RefreshTokenRepository } from '@src/infrastructure/persistence/prisma/repositories/refresh-token.repository';
import { AuthorizationCodeRepository } from '@src/infrastructure/persistence/prisma/repositories/authorization-code.repository';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { ScopeRepository } from '@src/infrastructure/persistence/prisma/repositories/scope.repository';
import { CryptoService } from '@src/core/application/services/crypto.service';
import { TokenService } from '@src/core/application/services/token.service';
import { JwtAuthGuard } from '@src/infrastructure/common/guards/jwt-auth.guard';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret-change-me',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [OauthController],
  providers: [
    ExchangeTokenHandler,
    AuthorizeHandler,
    RevokeTokenHandler,
    ClientRepository,
    RefreshTokenRepository,
    AuthorizationCodeRepository,
    ScopeRepository,
    {
      provide: 'UserRepositoryPort',
      useClass: UserRepository,
    },
    CryptoService,
    TokenService,
    JwtAuthGuard,
  ],
  exports: [TokenService, JwtAuthGuard],
})
export class OauthModule {}

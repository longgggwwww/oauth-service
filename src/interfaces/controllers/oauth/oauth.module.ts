import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/persistence/prisma/prisma.module';
import { OauthController } from './oauth.controller';
import { RegisterClientHandler } from '@src/core/application/use-cases/client/commands/handlers/register-client.handler';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';
import { CryptoService } from '@src/core/application/services/crypto.service';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [OauthController],
  providers: [
    RegisterClientHandler,
    {
      provide: 'ClientRepositoryPort',
      useClass: ClientRepository,
    },
    {
      provide: 'UserRepositoryPort',
      useClass: UserRepository,
    },
    CryptoService,
  ],
})
export class OauthModule {}

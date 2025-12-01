// src/interfaces/controllers/client/client.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/persistence/prisma/prisma.module';
import { RedisModule } from '@src/infrastructure/persistence/redis/redis.module';
import { CryptoModule } from '@src/infrastructure/crypto/crypto.module';
import { OauthModule } from '../oauth/oauth.module';
import { ClientController } from './client.controller';
import { GetUserClientsHandler } from '@src/core/application/use-cases/client/queries/handlers/get-user-clients.handler';
import { GetClientHandler } from '@src/core/application/use-cases/client/queries/handlers/get-client.handler';
import { GetClientByClientIdHandler } from '@src/core/application/use-cases/client/queries/handlers/get-client-by-client-id.handler';
import { UpdateClientHandler } from '@src/core/application/use-cases/client/commands/handlers/update-client.handler';
import { DeleteClientHandler } from '@src/core/application/use-cases/client/commands/handlers/delete-client.handler';
import { DeleteManyClientsHandler } from '@src/core/application/use-cases/client/commands/handlers/delete-many-clients.handler';
import { RegisterClientHandler } from '@src/core/application/use-cases/client/commands/handlers/register-client.handler';
import { RegenerateClientSecretHandler } from '@src/core/application/use-cases/client/commands/handlers/regenerate-client-secret.handler';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { CachedTokenRepository } from '@src/infrastructure/persistence/redis/repositories/cached-token.repository';

@Module({
  imports: [CqrsModule, PrismaModule, RedisModule, CryptoModule, OauthModule],
  controllers: [ClientController],
  providers: [
    GetUserClientsHandler,
    GetClientHandler,
    GetClientByClientIdHandler,
    UpdateClientHandler,
    DeleteClientHandler,
    DeleteManyClientsHandler,
    RegisterClientHandler,
    RegenerateClientSecretHandler,
    {
      provide: 'ClientRepositoryPort',
      useClass: ClientRepository,
    },
    {
      provide: 'TokenRepositoryPort',
      useClass: CachedTokenRepository,
    },
  ],
})
export class ClientModule {}

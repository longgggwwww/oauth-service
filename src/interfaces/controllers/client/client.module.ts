// src/interfaces/controllers/client/client.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@src/infrastructure/persistence/prisma/prisma.module';
import { RedisModule } from '@src/infrastructure/persistence/redis/redis.module';
import { CryptoModule } from '@src/infrastructure/crypto/crypto.module';
import { ClientController } from './client.controller';
import { GetUserClientsHandler } from '@src/core/application/use-cases/client/queries/handlers/get-user-clients.handler';
import { GetAllClientsHandler } from '@src/core/application/use-cases/client/queries/handlers/get-all-clients.handler';
import { GetClientHandler } from '@src/core/application/use-cases/client/queries/handlers/get-client.handler';
import { UpdateClientHandler } from '@src/core/application/use-cases/client/commands/handlers/update-client.handler';
import { DeleteClientHandler } from '@src/core/application/use-cases/client/commands/handlers/delete-client.handler';
import { RegisterClientHandler } from '@src/core/application/use-cases/client/commands/handlers/register-client.handler';
import { ClientRepository } from '@src/infrastructure/persistence/prisma/repositories/client.repository';
import { CachedTokenRepository } from '@src/infrastructure/persistence/redis/repositories/cached-token.repository';

@Module({
  imports: [CqrsModule, PrismaModule, RedisModule, CryptoModule],
  controllers: [ClientController],
  providers: [
    GetUserClientsHandler,
    GetAllClientsHandler,
    GetClientHandler,
    UpdateClientHandler,
    DeleteClientHandler,
    RegisterClientHandler,
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
export class ClientModule { }

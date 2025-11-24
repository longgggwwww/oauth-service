import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './user.controller';
import { OauthModule } from '../oauth/oauth.module';
import { PrismaModule } from '@src/infrastructure/persistence/prisma/prisma.module';
import { GetUserProfileHandler } from '@src/core/application/use-cases/user/queries/handlers/get-user-profile.handler';
import { UpdateUserProfileHandler } from '@src/core/application/use-cases/user/commands/handlers/update-user-profile.handler';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';

@Module({
    imports: [CqrsModule, OauthModule, PrismaModule],
    controllers: [UserController],
    providers: [
        GetUserProfileHandler,
        UpdateUserProfileHandler,
        UserRepository,
    ],
})
export class UserModule { }

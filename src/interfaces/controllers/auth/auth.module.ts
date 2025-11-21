import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';

@Module({
    imports: [CqrsModule],
    controllers: [AuthController],
    providers: [],
})
export class AuthModule { }

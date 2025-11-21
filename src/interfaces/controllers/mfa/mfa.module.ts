import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MfaController } from './mfa.controller';

@Module({
    imports: [CqrsModule],
    controllers: [MfaController],
    providers: [],
})
export class MfaModule { }

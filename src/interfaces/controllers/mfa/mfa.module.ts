import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MfaController } from './mfa.controller';
import { OauthModule } from '../oauth/oauth.module';

@Module({
  imports: [CqrsModule, OauthModule],
  controllers: [MfaController],
  providers: [],
})
export class MfaModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './interfaces/controllers/oauth/oauth.module';
import { ClientModule } from './interfaces/controllers/client/client.module';
import { AuthModule } from './interfaces/controllers/auth/auth.module';
import { UserModule } from './interfaces/controllers/user/user.module';
import { MfaModule } from './interfaces/controllers/mfa/mfa.module';

@Module({
  imports: [OauthModule, ClientModule, AuthModule, UserModule, MfaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

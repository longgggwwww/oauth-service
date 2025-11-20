import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './interfaces/controllers/oauth/oauth.module';
import { ClientModule } from './interfaces/controllers/client/client.module';

@Module({
  imports: [OauthModule, ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Controller, Post, Get, Body, Query, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import { AuthorizeRequest } from './dto/requests/authorize.request';
import { TokenRequest } from './dto/requests/token.request';
import { RevokeTokenRequest } from './dto/requests/revoke-token.request';
import { AuthorizeCommand } from '@src/core/application/use-cases/oauth/commands/authorize.command';
import { ExchangeTokenCommand } from '@src/core/application/use-cases/oauth/commands/exchange-token.command';
import { RevokeTokenCommand } from '@src/core/application/use-cases/oauth/commands/revoke-token.command';
import { GetUserInfoQuery } from '@src/core/application/use-cases/oauth/queries/get-user-info.query';
import { UserInfoResponse } from './dto/responses/userinfo.response';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }



  @Get('authorize')
  async authorize(@Query() request: AuthorizeRequest, @Req() req) {
    // TODO: Check if user is logged in via session/cookie
    const userId = 'dummy-user-id'; // Replace with actual user extraction if logged in
    const command = new AuthorizeCommand(request, userId);
    return this.commandBus.execute(command);
  }

  @Post('token')
  @HttpCode(200)
  async token(@Body() request: TokenRequest) {
    const command = new ExchangeTokenCommand(request);
    return this.commandBus.execute(command);
  }

  @Post('revoke')
  @HttpCode(200)
  async revoke(@Body() request: RevokeTokenRequest) {
    const command = new RevokeTokenCommand(request);
    await this.commandBus.execute(command);
  }

  @Get('userinfo')
  async userinfo(@Req() req): Promise<UserInfoResponse> {
    // TODO: Extract access token from Authorization header
    const accessToken = req.headers.authorization?.split(' ')[1];
    const query = new GetUserInfoQuery(accessToken);
    return this.queryBus.execute(query);
  }

  @Get('.well-known/openid-configuration')
  async discovery(@Req() req) {
    const issuer = `${req.protocol}://${req.get('host')}`;
    return {
      issuer: issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      userinfo_endpoint: `${issuer}/oauth/userinfo`,
      jwks_uri: `${issuer}/oauth/jwks`,
      scopes_supported: ['openid', 'profile', 'email'],
      response_types_supported: ['code', 'token', 'id_token', 'code id_token'],
      grant_types_supported: ['authorization_code', 'refresh_token', 'client_credentials'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
    };
  }

  @Get('jwks')
  async jwks() {
    // TODO: Return actual public keys
    return {
      keys: [],
    };
  }
}

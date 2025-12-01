import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
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
import { JwtAuthGuard } from '@src/infrastructure/common/guards/jwt-auth.guard';
import { CurrentUser } from '@src/infrastructure/common/decorators/current-user.decorator';
import type { JwtPayload } from '@src/core/application/services/token.service';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('authorize')
  async authorize(@Query() request: AuthorizeRequest, @Req() req, @Res() res) {
    // TODO: Replace with actual user session lookup
    const userId = req.user && req.user.id ? req.user.id : undefined;
    const command = new AuthorizeCommand(request, userId);
    const result = await this.commandBus.execute(command);

    // If handler indicates login required, redirect user to login
    if (result && result.login_required && result.redirect_to_login) {
      return res.redirect(result.redirect_to_login);
    }

    // If handler returned redirectUri, perform redirect
    if (result && result.redirectUri) {
      return res.redirect(result.redirectUri);
    }

    // Fallback: return JSON
    return result;
  }

  @Post('token')
  @HttpCode(200)
  async token(@Body() request: TokenRequest, @Req() req) {
    // Support HTTP Basic auth for client authentication (per RFC6749)
    const authHeader = req.headers && req.headers['authorization'];
    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Basic') {
        try {
          const decoded = Buffer.from(parts[1], 'base64').toString('utf8');
          const idx = decoded.indexOf(':');
          if (idx > -1) {
            const clientId = decoded.slice(0, idx);
            const clientSecret = decoded.slice(idx + 1);
            // Populate request fields if not already set
            if (!request.client_id) request.client_id = clientId;
            if (!request.client_secret) request.client_secret = clientSecret;
          }
        } catch (e) {
          // ignore parse errors and let validation handle missing credentials
        }
      }
    }
    // If grant_type isn't provided, default to client_credentials
    if (!request.grant_type) {
      request.grant_type = 'client_credentials';
    }

    const command = new ExchangeTokenCommand(request);
    return this.commandBus.execute(command);
  }

  @Post('revoke')
  async revoke(@Body() request: RevokeTokenRequest, @Res() res) {
    const command = new RevokeTokenCommand(request);
    const revoked = await this.commandBus.execute(command);

    // If something was actually revoked, return 204 No Content.
    if (revoked) {
      return res.status(204).send();
    }

    // RFC 7009: If the token was invalid/unknown, still return success (200).
    // Provide a small JSON response so clients can detect success on 200.
    return res.status(200).json({ success: true, message: 'token revoked or invalid' });
  }

  @Get('userinfo')
  @UseGuards(JwtAuthGuard)
  async userinfo(@CurrentUser() user: JwtPayload): Promise<UserInfoResponse> {
    // User ID comes from JWT token payload
    if (!user.sub) {
      // This is a client credentials token (no user)
      return {
        sub: user.clientId,
        client_id: user.clientId,
      } as any;
    }

    const query = new GetUserInfoQuery(user.sub);
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
      grant_types_supported: [
        'authorization_code',
        'refresh_token',
        'client_credentials',
      ],
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

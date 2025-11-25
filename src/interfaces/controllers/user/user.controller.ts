import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '@src/core/application/use-cases/user/queries/get-user-profile.query';
import { UpdateUserProfileCommand } from '@src/core/application/use-cases/user/commands/update-user-profile.command';
import { UpdateUserProfileRequest } from './dto/requests/update-user-profile.request';
import { UserProfileResponse } from './dto/responses/user-profile.response';
import { JwtAuthGuard } from '@src/infrastructure/common/guards/jwt-auth.guard';
import { CurrentUser } from '@src/infrastructure/common/decorators/current-user.decorator';
import type { JwtPayload } from '@src/core/application/services/token.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload): Promise<any> {
    if (!user.sub) {
      throw new Error(
        'User ID not found in token. This endpoint requires user authentication, not client credentials.',
      );
    }
    const query = new GetUserProfileQuery(user.sub);
    const profile = await this.queryBus.execute(query);
    return {
      id: profile.id,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      profile: {
        givenName: profile.givenName || undefined,
        familyName: profile.familyName || undefined,
        fullName: profile.fullName || undefined,
        picture: profile.picture || undefined,
        avatarUrl: profile.avatarUrl || undefined,
        locale: profile.locale || undefined,
        timezone: profile.timezone || undefined,
        birthDate: profile.birthDate
          ? new Date(profile.birthDate).toISOString().split('T')[0]
          : undefined,
      },
    };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @Body() updateDto: UpdateUserProfileRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<any> {
    if (!user.sub) {
      throw new Error(
        'User ID not found in token. This endpoint requires user authentication, not client credentials.',
      );
    }
    const command = new UpdateUserProfileCommand(user.sub, updateDto);
    const profile = await this.commandBus.execute(command);
    return {
      id: profile.id,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      profile: {
        givenName: profile.givenName || undefined,
        familyName: profile.familyName || undefined,
        fullName: profile.fullName || undefined,
        picture: profile.picture || undefined,
        avatarUrl: profile.avatarUrl || undefined,
        locale: profile.locale || undefined,
        timezone: profile.timezone || undefined,
        birthDate: profile.birthDate
          ? new Date(profile.birthDate).toISOString().split('T')[0]
          : undefined,
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<any> {
    // Allow access if user is requesting their own profile or if they have admin authority
    if (user.sub !== id && !user.authorities?.includes('user:read')) {
      throw new Error(
        'Forbidden: You can only access your own profile or need user:read authority',
      );
    }
    const query = new GetUserProfileQuery(id);
    const profile = await this.queryBus.execute(query);
    return {
      id: profile.id,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      profile: {
        givenName: profile.givenName || undefined,
        familyName: profile.familyName || undefined,
        fullName: profile.fullName || undefined,
        picture: profile.picture || undefined,
        avatarUrl: profile.avatarUrl || undefined,
        locale: profile.locale || undefined,
        timezone: profile.timezone || undefined,
        birthDate: profile.birthDate
          ? new Date(profile.birthDate).toISOString().split('T')[0]
          : undefined,
      },
    };
  }
}

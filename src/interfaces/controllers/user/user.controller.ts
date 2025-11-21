import { Controller, Get, Put, Body, UseGuards, Req, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '@src/core/application/use-cases/user/queries/get-user-profile.query';
import { UpdateUserProfileCommand } from '@src/core/application/use-cases/user/commands/update-user-profile.command';
import { UpdateUserProfileRequest } from './dto/requests/update-user-profile.request';
import { UserProfileResponse } from './dto/responses/user-profile.response';

@Controller('users')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Get('me')
    async getMe(@Req() req): Promise<UserProfileResponse> {
        // TODO: Extract userId from token/guard
        const userId = 'dummy-user-id';
        const query = new GetUserProfileQuery(userId);
        const profile = await this.queryBus.execute(query);
        return UserProfileResponse.fromEntity(profile);
    }

    @Put('me')
    async updateMe(
        @Body() updateDto: UpdateUserProfileRequest,
        @Req() req
    ): Promise<UserProfileResponse> {
        // TODO: Extract userId from token/guard
        const userId = 'dummy-user-id';
        const command = new UpdateUserProfileCommand(userId, updateDto);
        const profile = await this.commandBus.execute(command);
        return UserProfileResponse.fromEntity(profile);
    }

    @Get(':id')
    async getUser(@Param('id') id: string): Promise<UserProfileResponse> {
        const query = new GetUserProfileQuery(id);
        const profile = await this.queryBus.execute(query);
        return UserProfileResponse.fromEntity(profile);
    }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserProfileCommand } from '../update-user-profile.command';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler implements ICommandHandler<UpdateUserProfileCommand> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: UpdateUserProfileCommand) {
        const { userId, updateDto } = command;

        // 1. Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // 2. Update profile (upsert - create if not exists)
        await this.userRepository.updateProfile(userId, updateDto);

        // 3. Get updated user with profile
        const updatedUser = await this.userRepository.getProfileWithUser(userId);

        // 4. Return formatted response
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            givenName: updatedUser.profile?.givenName,
            familyName: updatedUser.profile?.familyName,
            fullName: updatedUser.profile?.fullName,
            picture: updatedUser.profile?.picture,
            avatarUrl: updatedUser.profile?.avatarUrl,
            locale: updatedUser.profile?.locale,
            timezone: updatedUser.profile?.timezone,
            birthDate: updatedUser.profile?.birthDate,
        };
    }
}


import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetUserProfileQuery } from '../get-user-profile.query';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(query: GetUserProfileQuery) {
        // Get user with profile
        const userWithProfile = await this.userRepository.getProfileWithUser(query.userId);

        if (!userWithProfile) {
            throw new NotFoundException(`User with ID ${query.userId} not found`);
        }

        // Return complete profile data
        return {
            id: userWithProfile.id,
            email: userWithProfile.email,
            phoneNumber: userWithProfile.phoneNumber,
            givenName: userWithProfile.profile?.givenName,
            familyName: userWithProfile.profile?.familyName,
            picture: userWithProfile.profile?.picture,
            avatarUrl: userWithProfile.profile?.avatarUrl,
            locale: userWithProfile.profile?.locale,
            timezone: userWithProfile.profile?.timezone,
            birthDate: userWithProfile.profile?.birthDate,
        };
    }
}

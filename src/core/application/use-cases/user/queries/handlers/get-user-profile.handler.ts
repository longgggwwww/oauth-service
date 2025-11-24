import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '../get-user-profile.query';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(query: GetUserProfileQuery) {
        const user = await this.userRepository.findById(query.userId);
        if (!user) {
            throw new Error(`User with ID ${query.userId} not found`);
        }

        return {
            id: user.id,
            email: user.email,
            phoneNumber: user.phoneNumber,
        };
    }
}

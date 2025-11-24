import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserProfileCommand } from '../update-user-profile.command';
import { UserRepository } from '@src/infrastructure/persistence/prisma/repositories/user.repository';

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler implements ICommandHandler<UpdateUserProfileCommand> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: UpdateUserProfileCommand) {
        const user = await this.userRepository.findById(command.userId);
        if (!user) {
            throw new Error(`User with ID ${command.userId} not found`);
        }

        // TODO: Update user profile in database
        // For now, just return the user data
        return {
            id: user.id,
            email: user.email,
            phoneNumber: user.phoneNumber,
        };
    }
}

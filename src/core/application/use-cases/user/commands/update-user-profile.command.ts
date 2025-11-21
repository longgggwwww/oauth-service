import { UpdateUserProfileRequest } from '../../../../../interfaces/controllers/user/dto/requests/update-user-profile.request';

export class UpdateUserProfileCommand {
    constructor(
        public readonly userId: string,
        public readonly updateDto: UpdateUserProfileRequest,
    ) { }
}

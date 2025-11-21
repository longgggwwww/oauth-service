import { AuthorizeRequest } from '@src/interfaces/controllers/oauth/dto/requests/authorize.request';

export class AuthorizeCommand {
    constructor(
        public readonly request: AuthorizeRequest,
        public readonly userId?: string, // If user is logged in
    ) { }
}

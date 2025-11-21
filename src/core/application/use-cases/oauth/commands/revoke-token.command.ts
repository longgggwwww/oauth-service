import { RevokeTokenRequest } from '@src/interfaces/controllers/oauth/dto/requests/revoke-token.request';

export class RevokeTokenCommand {
    constructor(public readonly request: RevokeTokenRequest) { }
}

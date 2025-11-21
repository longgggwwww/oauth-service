import { RevokeTokenRequest } from '../../../../../interfaces/controllers/oauth/dto/requests/revoke-token.request';

export class RevokeTokenCommand {
    constructor(public readonly request: RevokeTokenRequest) { }
}

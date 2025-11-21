import { TokenRequest } from '../../../../../interfaces/controllers/oauth/dto/requests/token.request';

export class ExchangeTokenCommand {
    constructor(public readonly request: TokenRequest) { }
}

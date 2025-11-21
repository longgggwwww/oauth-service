import { TokenRequest } from '@src/interfaces/controllers/oauth/dto/requests/token.request';

export class ExchangeTokenCommand {
    constructor(public readonly request: TokenRequest) { }
}

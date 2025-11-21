export class AuthenticateCommand {
    constructor(
        public readonly email: string,
        public readonly password?: string,
        public readonly mfaToken?: string,
    ) { }
}


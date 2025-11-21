export class EnableMfaCommand {
    constructor(
        public readonly userId: string,
        public readonly type: 'totp' | 'sms',
        public readonly phoneNumber?: string,
    ) { }
}


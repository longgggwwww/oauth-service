export class FinishPasskeyRegistrationCommand {
    constructor(
        public readonly userId: string,
        public readonly attestationResponse: any,
    ) { }
}

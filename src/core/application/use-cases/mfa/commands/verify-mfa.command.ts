export class VerifyMfaCommand {
    constructor(
        public readonly userId: string,
        public readonly code: string,
        public readonly secret?: string,
    ) { }
}

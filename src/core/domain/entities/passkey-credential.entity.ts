export class PasskeyCredentialEntity {
    id: string;
    userId: string;
    credentialId: string;
    publicKey: string;
    signCount: number;
    transports: string[];
    createdAt: Date;

    constructor(
        id: string,
        userId: string,
        credentialId: string,
        publicKey: string,
        signCount: number,
        transports: string[],
        createdAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.credentialId = credentialId;
        this.publicKey = publicKey;
        this.signCount = signCount;
        this.transports = transports;
        this.createdAt = createdAt;
    }

    static create(
        userId: string,
        credentialId: string,
        publicKey: string,
        transports: string[],
    ): PasskeyCredentialEntity {
        return new PasskeyCredentialEntity(
            crypto.randomUUID(),
            userId,
            credentialId,
            publicKey,
            0,
            transports,
            new Date(),
        );
    }
}

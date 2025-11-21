export class PasskeyEntity {
    id: string;
    userId: string;
    credentialId: string;
    publicKey: string;
    transports?: string;
    counter: number;
    attestationType?: string;
    aaguid?: string;
    deviceType?: string;
    backedUp?: boolean;
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        credentialId: string,
        publicKey: string,
        counter: number,
        createdAt: Date,
        updatedAt: Date,
        transports?: string,
        attestationType?: string,
        aaguid?: string,
        deviceType?: string,
        backedUp?: boolean,
        lastUsedAt?: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.credentialId = credentialId;
        this.publicKey = publicKey;
        this.counter = counter;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.transports = transports;
        this.attestationType = attestationType;
        this.aaguid = aaguid;
        this.deviceType = deviceType;
        this.backedUp = backedUp;
        this.lastUsedAt = lastUsedAt;
    }
}

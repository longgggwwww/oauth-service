export class MfaDeviceEntity {
    id: string;
    userId: string;
    name: string;
    type: string; // "totp", "sms", "email", "webauthn"
    secret?: string;
    phoneNumber?: string;
    backupCodes?: any; // Using any for Json type for now, or define a specific type
    verified: boolean;
    lastUsedAt?: Date;
    lastSentAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        name: string,
        type: string,
        verified: boolean,
        createdAt: Date,
        updatedAt: Date,
        secret?: string,
        phoneNumber?: string,
        backupCodes?: any,
        lastUsedAt?: Date,
        lastSentAt?: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.verified = verified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.secret = secret;
        this.phoneNumber = phoneNumber;
        this.backupCodes = backupCodes;
        this.lastUsedAt = lastUsedAt;
        this.lastSentAt = lastSentAt;
    }
}

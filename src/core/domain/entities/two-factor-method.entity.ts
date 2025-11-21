export class TwoFactorMethodEntity {
    id: string;
    userId: string;
    type: string; // TOTP, SMS
    secret: string;
    isDefault: boolean;
    createdAt: Date;

    constructor(
        id: string,
        userId: string,
        type: string,
        secret: string,
        isDefault: boolean,
        createdAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.secret = secret;
        this.isDefault = isDefault;
        this.createdAt = createdAt;
    }

    static create(
        userId: string,
        type: string,
        secret: string,
        isDefault: boolean = false,
    ): TwoFactorMethodEntity {
        return new TwoFactorMethodEntity(
            crypto.randomUUID(),
            userId,
            type,
            secret,
            isDefault,
            new Date(),
        );
    }
}

export class PasswordCredentialEntity {
    id: string;
    userId: string;
    passwordHash: string;
    updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        passwordHash: string,
        updatedAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.passwordHash = passwordHash;
        this.updatedAt = updatedAt;
    }

    static create(userId: string, passwordHash: string): PasswordCredentialEntity {
        return new PasswordCredentialEntity(
            crypto.randomUUID(),
            userId,
            passwordHash,
            new Date(),
        );
    }
}

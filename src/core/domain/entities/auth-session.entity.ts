export class AuthSessionEntity {
    id: string;
    userId: string;
    isMfaCompleted: boolean;
    expiresAt: Date;

    constructor(
        id: string,
        userId: string,
        isMfaCompleted: boolean,
        expiresAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.isMfaCompleted = isMfaCompleted;
        this.expiresAt = expiresAt;
    }

    static create(userId: string, expiresInMinutes: number = 30): AuthSessionEntity {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

        return new AuthSessionEntity(
            crypto.randomUUID(),
            userId,
            false,
            expiresAt,
        );
    }

    completeMfa(): void {
        this.isMfaCompleted = true;
    }

    isExpired(): boolean {
        return this.expiresAt < new Date();
    }
}

export class AuthorizationCodeEntity {
    id: string;
    code: string;
    clientId: string;
    userId: string;
    sessionId?: string;
    scopes: string[];
    codeChallenge: string;
    expiresAt: Date;

    constructor(
        id: string,
        code: string,
        clientId: string,
        userId: string,
        scopes: string[],
        codeChallenge: string,
        expiresAt: Date,
        sessionId?: string,
    ) {
        this.id = id;
        this.code = code;
        this.clientId = clientId;
        this.userId = userId;
        this.sessionId = sessionId;
        this.scopes = scopes;
        this.codeChallenge = codeChallenge;
        this.expiresAt = expiresAt;
    }

    static create(
        code: string,
        clientId: string,
        userId: string,
        scopes: string[],
        codeChallenge: string,
        expiresInMinutes: number = 10,
        sessionId?: string,
    ): AuthorizationCodeEntity {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

        return new AuthorizationCodeEntity(
            crypto.randomUUID(),
            code,
            clientId,
            userId,
            scopes,
            codeChallenge,
            expiresAt,
            sessionId,
        );
    }

    isExpired(): boolean {
        return this.expiresAt < new Date();
    }
}

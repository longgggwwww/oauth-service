export class RefreshTokenEntity {
    id: string;
    token: string;
    clientId: string;
    userId?: string; // Nullable for M2M tokens
    scopes: string[];
    parentTokenId?: string;
    revoked: boolean;
    expiresAt: Date;
    createdAt: Date;

    constructor(
        id: string,
        token: string,
        clientId: string,
        scopes: string[],
        revoked: boolean,
        expiresAt: Date,
        createdAt: Date,
        userId?: string,
        parentTokenId?: string,
    ) {
        this.id = id;
        this.token = token;
        this.clientId = clientId;
        this.userId = userId;
        this.scopes = scopes;
        this.parentTokenId = parentTokenId;
        this.revoked = revoked;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }

    static create(
        token: string,
        clientId: string,
        scopes: string[],
        expiresAt: Date,
        userId?: string, // Optional for Client Credentials flow
        parentTokenId?: string,
    ): RefreshTokenEntity {
        return new RefreshTokenEntity(
            crypto.randomUUID(),
            token,
            clientId,
            scopes,
            false,
            expiresAt,
            new Date(),
            userId,
            parentTokenId,
        );
    }

    isUserToken(): boolean {
        return this.userId !== undefined && this.userId !== null;
    }

    isAppToken(): boolean {
        return !this.isUserToken();
    }

    isExpired(): boolean {
        return this.expiresAt < new Date();
    }

    revoke(): void {
        this.revoked = true;
    }
}

export class AccessTokenEntity {
    id: string;
    token: string;
    clientId: string;
    userId?: string;
    scopes: string[];
    expiresAt: Date;
    createdAt: Date;

    constructor(
        id: string,
        token: string,
        clientId: string,
        scopes: string[],
        expiresAt: Date,
        createdAt: Date,
        userId?: string,
    ) {
        this.id = id;
        this.token = token;
        this.clientId = clientId;
        this.userId = userId;
        this.scopes = scopes;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }

    static create(
        token: string,
        clientId: string,
        scopes: string[],
        expiresAt: Date,
        userId?: string,
    ): AccessTokenEntity {
        return new AccessTokenEntity(
            crypto.randomUUID(),
            token,
            clientId,
            scopes,
            expiresAt,
            new Date(),
            userId,
        );
    }

    isUserToken(): boolean {
        return this.userId !== undefined && this.userId !== null;
    }

    isAppToken(): boolean {
        return !this.isUserToken();
    }

    isExpired(): boolean {
        return this.expiresAt < new Date();
    }
}

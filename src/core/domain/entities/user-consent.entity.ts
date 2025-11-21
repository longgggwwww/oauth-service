export class UserConsentEntity {
    id: string;
    userId: string;
    clientId: string;
    grantedScopes: string[];

    constructor(
        id: string,
        userId: string,
        clientId: string,
        grantedScopes: string[],
    ) {
        this.id = id;
        this.userId = userId;
        this.clientId = clientId;
        this.grantedScopes = grantedScopes;
    }

    static create(
        userId: string,
        clientId: string,
        grantedScopes: string[],
    ): UserConsentEntity {
        return new UserConsentEntity(
            crypto.randomUUID(),
            userId,
            clientId,
            grantedScopes,
        );
    }

    hasScope(scope: string): boolean {
        return this.grantedScopes.includes(scope);
    }
}

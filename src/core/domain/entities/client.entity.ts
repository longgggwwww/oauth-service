import { randomUUID } from 'crypto';

export enum ClientRole {
  SERVICE_ACCOUNT = 'SERVICE_ACCOUNT',
  THIRD_PARTY_APP = 'THIRD_PARTY_APP',
}

export enum GrantType {
  AUTHORIZATION_CODE = 'AUTHORIZATION_CODE',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  CLIENT_CREDENTIALS = 'CLIENT_CREDENTIALS',
  PASSWORD = 'PASSWORD',
}

export class ClientAppEntity {
  id: string;
  clientId: string;
  clientSecret: string;
  appName: string;
  description?: string;
  ownerId?: string;
  role: ClientRole;
  authorities: string[];
  redirectUris: string[];
  allowedGrantTypes: GrantType[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    clientId: string,
    clientSecret: string,
    appName: string,
    role: ClientRole,
    authorities: string[],
    redirectUris: string[],
    allowedGrantTypes: GrantType[],
    createdAt: Date,
    updatedAt: Date,
    description?: string,
    ownerId?: string,
  ) {
    this.id = id;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.appName = appName;
    this.role = role;
    this.authorities = authorities;
    this.redirectUris = redirectUris;
    this.allowedGrantTypes = allowedGrantTypes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.description = description;
    this.ownerId = ownerId;
  }

  static create(
    clientId: string,
    clientSecret: string,
    appName: string,
    redirectUris: string[],
    allowedGrantTypes: GrantType[],
    role: ClientRole = ClientRole.THIRD_PARTY_APP,
    authorities: string[] = [],
    description?: string,
    ownerId?: string,
  ): ClientAppEntity {
    return new ClientAppEntity(
      randomUUID(),
      clientId,
      clientSecret,
      appName,
      role,
      authorities,
      redirectUris,
      allowedGrantTypes,
      new Date(),
      new Date(),
      description,
      ownerId,
    );
  }

  isServiceAccount(): boolean {
    return this.role === ClientRole.SERVICE_ACCOUNT;
  }

  hasAuthority(authority: string): boolean {
    return this.authorities.includes(authority);
  }

  supportsGrantType(grantType: GrantType): boolean {
    return this.allowedGrantTypes.includes(grantType);
  }

  updateSecret(hashedSecret: string): void {
    this.clientSecret = hashedSecret;
    this.updatedAt = new Date();
  }
}

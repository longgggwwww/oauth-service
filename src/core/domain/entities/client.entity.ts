export class ClientEntity {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  grantTypes: string[];
  scope?: string[];
  websiteUrl?: string;
  logoUrl?: string;
  contacts?: string[];
  autoApprove: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  static create(
    clientId: string,
    clientSecret: string,
    name: string,
    redirectUris: string[],
    userId: string,
    description?: string,
    grantTypes?: string[],
    scope?: string[],
    websiteUrl?: string,
    logoUrl?: string,
    contacts?: string[],
  ): ClientEntity {
    const client = new ClientEntity();
    client.id = crypto.randomUUID(); // or use a proper ID generator
    client.clientId = clientId;
    client.clientSecret = clientSecret;
    client.name = name;
    client.redirectUris = redirectUris;
    client.userId = userId;
    client.description = description;
    client.grantTypes = grantTypes || ['authorization_code'];
    client.scope = scope;
    client.websiteUrl = websiteUrl;
    client.logoUrl = logoUrl;
    client.contacts = contacts;
    client.autoApprove = false;
    client.createdAt = new Date();
    client.updatedAt = new Date();
    return client;
  }
}

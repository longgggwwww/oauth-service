export class ClientRegistrationResponse {
  id: string;
  clientId: string;
  clientSecret: string;
  name: string;
  redirectUris: string[];
  createdAt: Date;
}

// Types
export interface ClientSummary {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  scope?: string[];
  websiteUrl?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

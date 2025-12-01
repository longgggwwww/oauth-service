// src/interfaces/controllers/client/dto/responses/client-summary.response.ts
import { ClientSummary } from '@src/core/shared/types';

export class ClientSummaryResponse {
  id: string;
  client_id: string;
  name: string;
  redirect_uris: string[];
  scope?: string[];
  website_url?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;

  static fromSummary(summary: ClientSummary): ClientSummaryResponse {
    const response = new ClientSummaryResponse();
    response.id = summary.id;
    response.client_id = summary.clientId;
    response.name = summary.name;
    response.redirect_uris = summary.redirectUris;
    response.scope = summary.scope;
    response.website_url = summary.websiteUrl;
    response.logo_url = summary.logoUrl;
    response.created_at = summary.createdAt;
    response.updated_at = summary.updatedAt;
    return response;
  }
}

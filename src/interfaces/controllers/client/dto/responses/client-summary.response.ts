// src/interfaces/controllers/client/dto/responses/client-summary.response.ts
import { ClientSummary } from '../../../../../core/shared/types';

export class ClientSummaryResponse {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  scope?: string[];
  websiteUrl?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromSummary(summary: ClientSummary): ClientSummaryResponse {
    const response = new ClientSummaryResponse();
    response.id = summary.id;
    response.clientId = summary.clientId;
    response.name = summary.name;
    response.redirectUris = summary.redirectUris;
    response.scope = summary.scope;
    response.websiteUrl = summary.websiteUrl;
    response.logoUrl = summary.logoUrl;
    response.createdAt = summary.createdAt;
    response.updatedAt = summary.updatedAt;
    return response;
  }
}

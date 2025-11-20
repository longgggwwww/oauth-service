// src/interfaces/controllers/client/dto/responses/client-details.response.ts
import { ClientEntity } from '../../../../../core/domain/entities/client.entity';

export class ClientDetailsResponse {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  redirectUris: string[];
  grantTypes: string[];
  scope?: string[];
  websiteUrl?: string;
  logoUrl?: string;
  contacts?: string[];
  autoApprove: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: ClientEntity): ClientDetailsResponse {
    const response = new ClientDetailsResponse();
    response.id = entity.id;
    response.clientId = entity.clientId;
    response.name = entity.name;
    response.description = entity.description;
    response.redirectUris = entity.redirectUris;
    response.grantTypes = entity.grantTypes;
    response.scope = entity.scope;
    response.websiteUrl = entity.websiteUrl;
    response.logoUrl = entity.logoUrl;
    response.contacts = entity.contacts;
    response.autoApprove = entity.autoApprove;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}

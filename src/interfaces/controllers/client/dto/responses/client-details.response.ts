// src/interfaces/controllers/client/dto/responses/client-details.response.ts
import { ClientAppEntity } from '../../../../../core/domain/entities/client.entity';

export class ClientDetailsResponse {
  id: string;
  clientId: string;
  appName: string;
  description?: string;
  redirectUris: string[];
  allowedGrantTypes: string[];
  role: string;
  authorities: string[];
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: ClientAppEntity): ClientDetailsResponse {
    const response = new ClientDetailsResponse();
    response.id = entity.id;
    response.clientId = entity.clientId;
    response.appName = entity.appName;
    response.description = entity.description;
    response.redirectUris = entity.redirectUris;
    response.allowedGrantTypes = entity.allowedGrantTypes;
    response.role = entity.role;
    response.authorities = entity.authorities;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}

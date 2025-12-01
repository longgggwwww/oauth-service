// src/interfaces/controllers/client/dto/responses/client-details.response.ts
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import { toOAuth2GrantTypes } from '@src/core/shared/utils/grant-type.utils';

export class ClientDetailsResponse {
  id: string;
  client_id: string;
  app_name: string;
  description?: string;
  redirect_uris: string[];
  grant_types: string[];
  role: string;
  authorities: string[];
  created_at: Date;
  updated_at: Date;

  static fromEntity(entity: ClientAppEntity): ClientDetailsResponse {
    const response = new ClientDetailsResponse();
    response.id = entity.id;
    response.client_id = entity.clientId;
    response.app_name = entity.appName;
    response.description = entity.description;
    response.redirect_uris = entity.redirectUris;
    response.grant_types = toOAuth2GrantTypes(entity.allowedGrantTypes);
    response.role = entity.role.toLowerCase();
    response.authorities = entity.authorities;
    response.created_at = entity.createdAt;
    response.updated_at = entity.updatedAt;
    return response;
  }
}

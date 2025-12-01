import { ClientAppEntity } from '@src/core/domain/entities/client.entity';
import { toOAuth2GrantTypes } from '@src/core/shared/utils/grant-type.utils';

export class ClientRegistrationResponse {
  id: string;
  client_id: string;
  client_secret: string;
  name: string;
  grant_types: string[];
  redirect_uris: string[];
  created_at: Date;

  static fromEntity(
    entity: ClientAppEntity,
    plainSecret: string,
  ): ClientRegistrationResponse {
    const response = new ClientRegistrationResponse();
    response.id = entity.id;
    response.client_id = entity.clientId;
    response.client_secret = plainSecret;
    response.name = entity.appName;
    response.grant_types = toOAuth2GrantTypes(entity.allowedGrantTypes);
    response.redirect_uris = entity.redirectUris;
    response.created_at = entity.createdAt;
    return response;
  }
}

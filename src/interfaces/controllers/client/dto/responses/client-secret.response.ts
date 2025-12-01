// src/interfaces/controllers/client/dto/responses/client-secret.response.ts
import { ClientAppEntity } from '@src/core/domain/entities/client.entity';

export class ClientSecretResponse {
  client_id: string;
  client_secret: string;
  message: string;

  static fromEntity(
    entity: ClientAppEntity,
    plainSecret: string,
  ): ClientSecretResponse {
    const response = new ClientSecretResponse();
    response.client_id = entity.clientId;
    response.client_secret = plainSecret;
    response.message =
      'Client secret has been regenerated. Please store it securely as it cannot be retrieved again.';
    return response;
  }
}

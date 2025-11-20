// src/interfaces/controllers/client/dto/responses/client-list.response.ts
import { ClientSummary } from '../../../../../core/shared/types';
import { ClientSummaryResponse } from './client-summary.response';

export class ClientListResponse {
  clients: ClientSummaryResponse[];

  static fromClients(clients: ClientSummary[]): ClientListResponse {
    return {
      clients: clients.map(ClientSummaryResponse.fromSummary),
    };
  }
}

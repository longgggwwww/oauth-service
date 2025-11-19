import { ClientEntity } from '../../../domain/entities/client.entity';

export interface ClientRepositoryPort {
  findByClientId(clientId: string): Promise<ClientEntity | null>;
  save(client: ClientEntity): Promise<ClientEntity>;
}

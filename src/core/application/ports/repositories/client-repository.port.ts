import { ClientEntity } from '../../../domain/entities/client.entity';

export interface ClientRepositoryPort {
  findByClientId(clientId: string): Promise<ClientEntity | null>;
  findById(id: string): Promise<ClientEntity | null>;
  findByUserId(userId: string): Promise<ClientEntity[]>;
  save(client: ClientEntity): Promise<ClientEntity>;
  update(client: ClientEntity): Promise<ClientEntity>;
  delete(id: string): Promise<void>;
}

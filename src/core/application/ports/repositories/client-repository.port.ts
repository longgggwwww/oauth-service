import { ClientAppEntity } from '@src/core/domain/entities/client.entity';

export interface ClientRepositoryPort {
  findByClientId(clientId: string): Promise<ClientAppEntity | null>;
  findById(id: string): Promise<ClientAppEntity | null>;
  findAll(): Promise<ClientAppEntity[]>;
  save(client: ClientAppEntity): Promise<ClientAppEntity>;
  delete(id: string): Promise<void>;
}

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientAppEntity, ClientRole, GrantType } from '@src/core/domain/entities/client.entity';
import { ClientRepositoryPort } from '@src/core/application/ports/repositories/client-repository.port';

@Injectable()
export class ClientRepository implements ClientRepositoryPort {
  constructor(private readonly prisma: PrismaClient) { }

  async findByClientId(clientId: string): Promise<ClientAppEntity | null> {
    const client = await this.prisma.clientApp.findUnique({
      where: { clientId },
    });
    if (!client) return null;

    return new ClientAppEntity(
      client.id,
      client.clientId,
      client.clientSecret,
      client.appName,
      client.role as ClientRole,
      client.authorities,
      client.redirectUris,
      client.allowedGrantTypes as GrantType[],
      client.createdAt,
      client.updatedAt,
      client.description || undefined,
    );
  }

  async findById(id: string): Promise<ClientAppEntity | null> {
    const client = await this.prisma.clientApp.findUnique({
      where: { id },
    });
    if (!client) return null;

    return new ClientAppEntity(
      client.id,
      client.clientId,
      client.clientSecret,
      client.appName,
      client.role as ClientRole,
      client.authorities,
      client.redirectUris,
      client.allowedGrantTypes as GrantType[],
      client.createdAt,
      client.updatedAt,
      client.description || undefined,
    );
  }

  async save(clientEntity: ClientAppEntity): Promise<ClientAppEntity> {
    const client = await this.prisma.clientApp.upsert({
      where: { clientId: clientEntity.clientId },
      create: {
        id: clientEntity.id,
        clientId: clientEntity.clientId,
        clientSecret: clientEntity.clientSecret,
        appName: clientEntity.appName,
        description: clientEntity.description,
        role: clientEntity.role,
        authorities: clientEntity.authorities,
        redirectUris: clientEntity.redirectUris,
        allowedGrantTypes: clientEntity.allowedGrantTypes,
      },
      update: {
        clientSecret: clientEntity.clientSecret,
        appName: clientEntity.appName,
        description: clientEntity.description,
        role: clientEntity.role,
        authorities: clientEntity.authorities,
        redirectUris: clientEntity.redirectUris,
        allowedGrantTypes: clientEntity.allowedGrantTypes,
      },
    });

    return new ClientAppEntity(
      client.id,
      client.clientId,
      client.clientSecret,
      client.appName,
      client.role as ClientRole,
      client.authorities,
      client.redirectUris,
      client.allowedGrantTypes as GrantType[],
      client.createdAt,
      client.updatedAt,
      client.description || undefined,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.clientApp.delete({
      where: { id },
    });
  }

  async findServiceAccounts(): Promise<ClientAppEntity[]> {
    const clients = await this.prisma.clientApp.findMany({
      where: { role: ClientRole.SERVICE_ACCOUNT },
    });

    return clients.map(
      (c) =>
        new ClientAppEntity(
          c.id,
          c.clientId,
          c.clientSecret,
          c.appName,
          c.role as ClientRole,
          c.authorities,
          c.redirectUris,
          c.allowedGrantTypes as GrantType[],
          c.createdAt,
          c.updatedAt,
          c.description || undefined,
        ),
    );
  }
}

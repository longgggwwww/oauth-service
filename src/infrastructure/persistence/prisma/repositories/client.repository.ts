import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientEntity } from '../../../../core/domain/entities/client.entity';
import { ClientRepositoryPort } from '../../../../core/application/ports/repositories/client-repository.port';

@Injectable()
export class ClientRepository implements ClientRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findByClientId(clientId: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({
      where: { client_id: clientId },
    });
    if (!client) return null;
    return {
      id: client.id,
      name: client.name,
      description: client.description || undefined,
      clientId: client.client_id,
      clientSecret: client.client_secret,
      redirectUris: client.redirect_uris as string[],
      grantTypes: client.grant_types as string[],
      scope: client.scope ? (client.scope as string[]) : undefined,
      websiteUrl: client.website_url || undefined,
      logoUrl: client.logo_url || undefined,
      contacts: client.contacts ? (client.contacts as string[]) : undefined,
      autoApprove: client.auto_approve,
      userId: client.user_id,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    };
  }

  async findById(id: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client) return null;
    return {
      id: client.id,
      name: client.name,
      description: client.description || undefined,
      clientId: client.client_id,
      clientSecret: client.client_secret,
      redirectUris: client.redirect_uris as string[],
      grantTypes: client.grant_types as string[],
      scope: client.scope ? (client.scope as string[]) : undefined,
      websiteUrl: client.website_url || undefined,
      logoUrl: client.logo_url || undefined,
      contacts: client.contacts ? (client.contacts as string[]) : undefined,
      autoApprove: client.auto_approve,
      userId: client.user_id,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    };
  }

  async findByUserId(userId: string): Promise<ClientEntity[]> {
    const clients = await this.prisma.client.findMany({
      where: { user_id: userId },
    });
    return clients.map((client) => ({
      id: client.id,
      name: client.name,
      description: client.description || undefined,
      clientId: client.client_id,
      clientSecret: client.client_secret,
      redirectUris: client.redirect_uris as string[],
      grantTypes: client.grant_types as string[],
      scope: client.scope ? (client.scope as string[]) : undefined,
      websiteUrl: client.website_url || undefined,
      logoUrl: client.logo_url || undefined,
      contacts: client.contacts ? (client.contacts as string[]) : undefined,
      autoApprove: client.auto_approve,
      userId: client.user_id,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    }));
  }

  async update(clientEntity: ClientEntity): Promise<ClientEntity> {
    const data = {
      name: clientEntity.name,
      description: clientEntity.description,
      client_id: clientEntity.clientId,
      client_secret: clientEntity.clientSecret,
      redirect_uris: clientEntity.redirectUris,
      grant_types: clientEntity.grantTypes,
      scope: clientEntity.scope,
      website_url: clientEntity.websiteUrl,
      logo_url: clientEntity.logoUrl,
      contacts: clientEntity.contacts,
      auto_approve: clientEntity.autoApprove,
      user_id: clientEntity.userId,
    };
    const client = await this.prisma.client.update({
      where: { id: clientEntity.id },
      data,
    });
    return {
      id: client.id,
      name: client.name,
      description: client.description || undefined,
      clientId: client.client_id,
      clientSecret: client.client_secret,
      redirectUris: client.redirect_uris as string[],
      grantTypes: client.grant_types as string[],
      scope: client.scope ? (client.scope as string[]) : undefined,
      websiteUrl: client.website_url || undefined,
      logoUrl: client.logo_url || undefined,
      contacts: client.contacts ? (client.contacts as string[]) : undefined,
      autoApprove: client.auto_approve,
      userId: client.user_id,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    });
  }

  async save(clientEntity: ClientEntity): Promise<ClientEntity> {
    const data = {
      name: clientEntity.name,
      description: clientEntity.description,
      client_id: clientEntity.clientId,
      client_secret: clientEntity.clientSecret,
      redirect_uris: clientEntity.redirectUris,
      grant_types: clientEntity.grantTypes,
      scope: clientEntity.scope,
      website_url: clientEntity.websiteUrl,
      logo_url: clientEntity.logoUrl,
      contacts: clientEntity.contacts,
      auto_approve: clientEntity.autoApprove,
      user_id: clientEntity.userId,
    };
    const client = await this.prisma.client.create({ data });
    return {
      id: client.id,
      name: client.name,
      description: client.description || undefined,
      clientId: client.client_id,
      clientSecret: client.client_secret,
      redirectUris: client.redirect_uris as string[],
      grantTypes: client.grant_types as string[],
      scope: client.scope ? (client.scope as string[]) : undefined,
      websiteUrl: client.website_url || undefined,
      logoUrl: client.logo_url || undefined,
      contacts: client.contacts ? (client.contacts as string[]) : undefined,
      autoApprove: client.auto_approve,
      userId: client.user_id,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
    };
  }
}

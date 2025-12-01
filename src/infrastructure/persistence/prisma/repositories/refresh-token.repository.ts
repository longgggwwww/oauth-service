import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface RefreshTokenData {
  id: string;
  token: string;
  clientId: string;
  userId?: string | null;
  scopes: string[];
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: {
    token: string;
    clientId: string;
    userId?: string | null;
    scopes: string[];
    expiresAt: Date;
  }): Promise<RefreshTokenData> {
    return this.prisma.refreshToken.create({
      data: {
        token: data.token,
        clientId: data.clientId,
        userId: data.userId,
        scopes: data.scopes,
        expiresAt: data.expiresAt,
        revoked: false,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshTokenData | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async revoke(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }

  async revokeAllForClient(clientId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { clientId },
      data: { revoked: true },
    });
  }

  async revokeByUserAndClient(userId: string, clientId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, clientId },
      data: { revoked: true },
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }
}

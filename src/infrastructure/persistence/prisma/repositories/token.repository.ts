import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RefreshTokenEntity } from '../../../../core/domain/entities/token.entity';

@Injectable()
export class TokenRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findRefreshTokenByToken(token: string): Promise<RefreshTokenEntity | null> {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { token },
        });
        if (!refreshToken) return null;

        return new RefreshTokenEntity(
            refreshToken.id,
            refreshToken.token,
            refreshToken.clientId,
            refreshToken.scopes,
            refreshToken.revoked,
            refreshToken.expiresAt,
            refreshToken.createdAt,
            refreshToken.userId || undefined,
            refreshToken.parentTokenId || undefined,
        );
    }

    async saveRefreshToken(tokenEntity: RefreshTokenEntity): Promise<void> {
        await this.prisma.refreshToken.upsert({
            where: { token: tokenEntity.token },
            create: {
                id: tokenEntity.id,
                token: tokenEntity.token,
                clientId: tokenEntity.clientId,
                userId: tokenEntity.userId || null,
                scopes: tokenEntity.scopes,
                parentTokenId: tokenEntity.parentTokenId,
                revoked: tokenEntity.revoked,
                expiresAt: tokenEntity.expiresAt,
                createdAt: tokenEntity.createdAt,
            },
            update: {
                revoked: tokenEntity.revoked,
            },
        });
    }

    async revokeRefreshToken(token: string): Promise<void> {
        await this.prisma.refreshToken.update({
            where: { token },
            data: { revoked: true },
        });
    }

    async findRefreshTokensByClientId(clientId: string): Promise<RefreshTokenEntity[]> {
        const tokens = await this.prisma.refreshToken.findMany({
            where: { clientId },
        });

        return tokens.map(
            (t) =>
                new RefreshTokenEntity(
                    t.id,
                    t.token,
                    t.clientId,
                    t.scopes,
                    t.revoked,
                    t.expiresAt,
                    t.createdAt,
                    t.userId || undefined,
                    t.parentTokenId || undefined,
                ),
        );
    }

    async findRefreshTokensByUserId(userId: string): Promise<RefreshTokenEntity[]> {
        const tokens = await this.prisma.refreshToken.findMany({
            where: { userId },
        });

        return tokens.map(
            (t) =>
                new RefreshTokenEntity(
                    t.id,
                    t.token,
                    t.clientId,
                    t.scopes,
                    t.revoked,
                    t.expiresAt,
                    t.createdAt,
                    t.userId || undefined,
                    t.parentTokenId || undefined,
                ),
        );
    }
}

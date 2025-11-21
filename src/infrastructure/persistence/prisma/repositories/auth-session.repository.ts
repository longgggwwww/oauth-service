import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthSessionEntity } from '../../../../core/domain/entities/auth-session.entity';

@Injectable()
export class AuthSessionRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<AuthSessionEntity | null> {
        const session = await this.prisma.authSession.findUnique({
            where: { id },
        });
        if (!session) return null;

        return new AuthSessionEntity(
            session.id,
            session.userId,
            session.isMfaCompleted,
            session.expiresAt,
        );
    }

    async save(session: AuthSessionEntity): Promise<void> {
        await this.prisma.authSession.upsert({
            where: { id: session.id },
            create: {
                id: session.id,
                userId: session.userId,
                isMfaCompleted: session.isMfaCompleted,
                expiresAt: session.expiresAt,
            },
            update: {
                isMfaCompleted: session.isMfaCompleted,
                expiresAt: session.expiresAt,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.authSession.delete({
            where: { id },
        });
    }

    async deleteExpired(): Promise<void> {
        await this.prisma.authSession.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}

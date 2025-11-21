import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PasswordCredentialEntity } from '@src/core/domain/entities/password-credential.entity';

@Injectable()
export class PasswordCredentialRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByUserId(userId: string): Promise<PasswordCredentialEntity | null> {
        const credential = await this.prisma.passwordCredential.findUnique({
            where: { userId },
        });
        if (!credential) return null;

        return new PasswordCredentialEntity(
            credential.id,
            credential.userId,
            credential.passwordHash,
            credential.updatedAt,
        );
    }

    async save(credential: PasswordCredentialEntity): Promise<void> {
        await this.prisma.passwordCredential.upsert({
            where: { userId: credential.userId },
            create: {
                id: credential.id,
                userId: credential.userId,
                passwordHash: credential.passwordHash,
                updatedAt: credential.updatedAt,
            },
            update: {
                passwordHash: credential.passwordHash,
                updatedAt: new Date(),
            },
        });
    }

    async delete(userId: string): Promise<void> {
        await this.prisma.passwordCredential.delete({
            where: { userId },
        });
    }
}

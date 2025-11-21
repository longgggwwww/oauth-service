import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PasskeyCredentialEntity } from '@src/core/domain/entities/passkey-credential.entity';

@Injectable()
export class PasskeyCredentialRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByCredentialId(credentialId: string): Promise<PasskeyCredentialEntity | null> {
        const passkey = await this.prisma.passkeyCredential.findUnique({
            where: { credentialId },
        });
        if (!passkey) return null;

        return new PasskeyCredentialEntity(
            passkey.id,
            passkey.userId,
            passkey.credentialId,
            passkey.publicKey,
            passkey.signCount,
            passkey.transports,
            passkey.createdAt,
        );
    }

    async findByUserId(userId: string): Promise<PasskeyCredentialEntity[]> {
        const passkeys = await this.prisma.passkeyCredential.findMany({
            where: { userId },
        });

        return passkeys.map(
            (p) =>
                new PasskeyCredentialEntity(
                    p.id,
                    p.userId,
                    p.credentialId,
                    p.publicKey,
                    p.signCount,
                    p.transports,
                    p.createdAt,
                ),
        );
    }

    async save(passkey: PasskeyCredentialEntity): Promise<void> {
        await this.prisma.passkeyCredential.upsert({
            where: { credentialId: passkey.credentialId },
            create: {
                id: passkey.id,
                userId: passkey.userId,
                credentialId: passkey.credentialId,
                publicKey: passkey.publicKey,
                signCount: passkey.signCount,
                transports: passkey.transports,
                createdAt: passkey.createdAt,
            },
            update: {
                signCount: passkey.signCount,
            },
        });
    }

    async delete(credentialId: string): Promise<void> {
        await this.prisma.passkeyCredential.delete({
            where: { credentialId },
        });
    }
}

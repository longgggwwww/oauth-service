import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TwoFactorMethodEntity } from '@src/core/domain/entities/two-factor-method.entity';

@Injectable()
export class TwoFactorMethodRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByUserId(userId: string): Promise<TwoFactorMethodEntity[]> {
        const methods = await this.prisma.twoFactorMethod.findMany({
            where: { userId },
        });

        return methods.map(
            (m) =>
                new TwoFactorMethodEntity(
                    m.id,
                    m.userId,
                    m.type,
                    m.secret,
                    m.isDefault,
                    m.createdAt,
                ),
        );
    }

    async findById(id: string): Promise<TwoFactorMethodEntity | null> {
        const method = await this.prisma.twoFactorMethod.findUnique({
            where: { id },
        });
        if (!method) return null;

        return new TwoFactorMethodEntity(
            method.id,
            method.userId,
            method.type,
            method.secret,
            method.isDefault,
            method.createdAt,
        );
    }

    async save(method: TwoFactorMethodEntity): Promise<void> {
        await this.prisma.twoFactorMethod.upsert({
            where: { id: method.id },
            create: {
                id: method.id,
                userId: method.userId,
                type: method.type,
                secret: method.secret,
                isDefault: method.isDefault,
                createdAt: method.createdAt,
            },
            update: {
                isDefault: method.isDefault,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.twoFactorMethod.delete({
            where: { id },
        });
    }
}

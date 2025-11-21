import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserAggregate } from '@src/core/domain/aggregates/user-aggregate';
import { UserRepositoryPort } from '@src/core/application/ports/repositories/user-repository.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) { }

  async findById(id: string): Promise<UserAggregate | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber || undefined,
      status: user.status as any,
      createdViaClientId: user.createdViaClientId || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber || undefined,
      status: user.status as any,
      createdViaClientId: user.createdViaClientId || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async save(user: UserAggregate): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        status: user.status,
        createdViaClientId: user.createdViaClientId,
      },
      update: {
        email: user.email,
        phoneNumber: user.phoneNumber,
        status: user.status,
      },
    });
  }
}

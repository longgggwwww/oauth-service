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

  async create(data: { email: string; phoneNumber?: string; status: string }): Promise<any> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        status: data.status as any,
      },
    });
  }

  async createProfile(userId: string, data: { fullName?: string }): Promise<any> {
    return this.prisma.userProfile.create({
      data: {
        userId,
        fullName: data.fullName,
      },
    });
  }

  async updateStatus(userId: string, status: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
    });
  }
}

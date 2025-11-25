import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserAggregate } from '@src/core/domain/aggregates/user-aggregate';
import { UserRepositoryPort } from '@src/core/application/ports/repositories/user-repository.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

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

  async create(data: {
    email: string;
    phoneNumber?: string;
    status: string;
  }): Promise<any> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        status: data.status as any,
      },
    });
  }

  async createProfile(
    userId: string,
    data: { fullName?: string },
  ): Promise<any> {
    return this.prisma.userProfile.create({
      data: {
        userId,
        fullName: data.fullName,
      },
    });
  }

  async getProfileWithUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      givenName?: string;
      familyName?: string;
      fullName?: string;
      picture?: string;
      avatarUrl?: string;
      locale?: string;
      timezone?: string;
      birthDate?: string;
    },
  ): Promise<any> {
    // Convert birthDate string to Date if provided
    const birthDateValue = data.birthDate
      ? new Date(data.birthDate)
      : undefined;

    console.log(`[UserRepository] Upserting profile for userId: ${userId}`, {
      data: {
        ...data,
        birthDate: birthDateValue,
      },
    });

    // Upsert profile (create if not exists, update if exists)
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        givenName: data.givenName,
        familyName: data.familyName,
        fullName: data.fullName,
        picture: data.picture,
        avatarUrl: data.avatarUrl,
        locale: data.locale,
        timezone: data.timezone,
        birthDate: birthDateValue,
      },
      update: {
        ...(data.givenName !== undefined && { givenName: data.givenName }),
        ...(data.familyName !== undefined && { familyName: data.familyName }),
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.picture !== undefined && { picture: data.picture }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.locale !== undefined && { locale: data.locale }),
        ...(data.timezone !== undefined && { timezone: data.timezone }),
        ...(data.birthDate !== undefined && { birthDate: birthDateValue }),
      },
    });

    console.log(
      `[UserRepository] Profile upserted successfully for userId: ${userId}`,
      { profileId: profile.id },
    );

    return profile;
  }

  async updateStatus(userId: string, status: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserAggregate } from '../../../../core/domain/aggregates/user-aggregate';
import { UserRepositoryPort } from '../../../../core/application/ports/repositories/user-repository.port';

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
      passwordHash: user.password_hash || undefined,
      username: user.username || undefined,
      emailVerified: user.email_verified,
      mfaEnabled: user.mfa_enabled,
      mfaSecret: user.mfa_secret || undefined,
      lastLoginAt: user.last_login_at || undefined,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      active: user.active,
    };
  }
}

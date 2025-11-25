import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EmailVerificationTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, token: string, expiresAt: Date) {
    return this.prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteByUserId(userId: string) {
    return this.prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired() {
    return this.prisma.emailVerificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

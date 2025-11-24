import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface AuthorizationCodeData {
  id: string;
  code: string;
  clientId: string;
  userId: string;
  sessionId?: string | null;
  scopes: string[];
  codeChallenge: string;
  expiresAt: Date;
}

@Injectable()
export class AuthorizationCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByCode(code: string): Promise<AuthorizationCodeData | null> {
    const authCode = await this.prisma.authorizationCode.findUnique({
      where: { code },
      include: { scopes: true },
    });
    if (!authCode) return null;

    return {
      id: authCode.id,
      code: authCode.code,
      clientId: authCode.clientId,
      userId: authCode.userId,
      sessionId: authCode.sessionId || null,
      scopes: authCode.scopes.map((s: any) => s.name),
      codeChallenge: authCode.codeChallenge,
      expiresAt: authCode.expiresAt,
    };
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.authorizationCode.delete({ where: { id } });
  }

  async save(data: {
    code: string;
    clientId: string;
    userId: string;
    sessionId?: string | null;
    scopeIds?: string[];
    codeChallenge: string;
    expiresAt: Date;
  }): Promise<any> {
    // Basic save helper that links existing scopes by id when provided
    return this.prisma.authorizationCode.create({
      data: {
        code: data.code,
        clientId: data.clientId,
        userId: data.userId,
        sessionId: data.sessionId,
        codeChallenge: data.codeChallenge,
        expiresAt: data.expiresAt,
        scopes: data.scopeIds
          ? { connect: data.scopeIds.map((id) => ({ id })) }
          : undefined,
      },
    });
  }
}

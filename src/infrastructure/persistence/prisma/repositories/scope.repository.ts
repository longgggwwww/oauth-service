import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ScopeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByNames(names: string[]): Promise<{ id: string; name: string }[]> {
    if (!names || names.length === 0) return [];
    const scopes = await this.prisma.scope.findMany({
      where: { name: { in: names } },
    });
    return scopes.map((s: any) => ({ id: s.id, name: s.name }));
  }
}

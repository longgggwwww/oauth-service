import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
      },
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule { }

import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: PrismaClient,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
      },
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}

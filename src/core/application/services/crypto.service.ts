import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  generateClientSecret(): string {
    return randomBytes(32).toString('hex');
  }

  generateClientId(): string {
    return randomUUID();
  }

  async hashSecret(secret: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(secret, salt);
  }

  async verifySecret(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

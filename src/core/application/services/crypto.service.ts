import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  generateClientSecret(): string {
    return randomBytes(32).toString('hex');
  }
}

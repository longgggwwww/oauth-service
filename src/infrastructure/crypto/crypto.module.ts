import { Module } from '@nestjs/common';

import { CryptoService } from '@src/core/application/services/crypto.service';

@Module({
    providers: [CryptoService],
    exports: [CryptoService],
})
export class CryptoModule { }

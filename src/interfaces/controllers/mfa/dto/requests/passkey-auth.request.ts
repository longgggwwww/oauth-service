import { IsNotEmpty, IsObject } from 'class-validator';

export class PasskeyAuthRequest {
    @IsObject()
    @IsNotEmpty()
    assertionResponse: any; // WebAuthn response
}

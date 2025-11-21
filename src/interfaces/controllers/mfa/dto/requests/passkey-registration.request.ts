import { IsNotEmpty, IsObject } from 'class-validator';

export class PasskeyRegistrationRequest {
    @IsObject()
    @IsNotEmpty()
    attestationResponse: any; // WebAuthn response
}

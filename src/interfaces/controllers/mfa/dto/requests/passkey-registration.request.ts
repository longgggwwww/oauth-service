import { IsNotEmpty, IsObject } from 'class-validator';

export class PasskeyRegistrationRequest {
  @IsObject()
  @IsNotEmpty()
  attestation_response: any; // WebAuthn response
}

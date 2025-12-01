import { IsNotEmpty, IsObject } from 'class-validator';

export class PasskeyAuthRequest {
  @IsObject()
  @IsNotEmpty()
  assertion_response: any; // WebAuthn response
}

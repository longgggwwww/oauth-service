import { IsEmail } from 'class-validator';

export class ResendVerificationEmailRequest {
  @IsEmail()
  email: string;
}

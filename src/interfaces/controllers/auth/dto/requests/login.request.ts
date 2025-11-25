import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  clientSecret?: string;

  @IsOptional()
  @IsString()
  mfaToken?: string;
}

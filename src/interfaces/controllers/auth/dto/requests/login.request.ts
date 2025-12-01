import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  client_id: string;

  @IsOptional()
  @IsString()
  client_secret?: string;

  @IsOptional()
  @IsString()
  mfa_token?: string;
}

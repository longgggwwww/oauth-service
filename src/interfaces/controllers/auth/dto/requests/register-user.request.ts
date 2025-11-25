import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class RegisterUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  phoneNumber: string;

  // Profile fields (optional)
  @IsString()
  givenName?: string;

  @IsString()
  familyName?: string;

  @IsString()
  fullName: string;

  @IsUrl()
  picture?: string;

  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}

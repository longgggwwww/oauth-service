import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsUrl,
  IsDateString,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

export class RegisterUserRequest {
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsDefined()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  phoneNumber: string;

  // Profile fields (optional)
  @IsOptional()
  @IsString()
  givenName?: string;

  @IsOptional()
  @IsString()
  familyName?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsUrl()
  picture?: string;

  @IsOptional()
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

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
  phone_number: string;

  // Profile fields (optional)
  @IsOptional()
  @IsString()
  given_name?: string;

  @IsOptional()
  @IsString()
  family_name?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  full_name: string;

  @IsOptional()
  @IsUrl()
  picture?: string;

  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;
}

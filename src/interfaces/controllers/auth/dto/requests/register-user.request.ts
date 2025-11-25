import { IsEmail, IsString, IsOptional, MinLength, IsUrl, IsDateString } from 'class-validator';

export class RegisterUserRequest {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    // Profile fields (optional)
    @IsOptional()
    @IsString()
    givenName?: string;

    @IsOptional()
    @IsString()
    familyName?: string;

    @IsOptional()
    @IsString()
    fullName?: string;

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

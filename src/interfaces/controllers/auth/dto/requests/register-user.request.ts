import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class RegisterUserRequest {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}


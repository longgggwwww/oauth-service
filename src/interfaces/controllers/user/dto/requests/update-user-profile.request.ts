import { IsString, IsOptional, IsUrl, IsDateString } from 'class-validator';

export class UpdateUserProfileRequest {
    @IsOptional()
    @IsString()
    givenName?: string;

    @IsOptional()
    @IsString()
    familyName?: string;

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
    birthDate?: Date;
}

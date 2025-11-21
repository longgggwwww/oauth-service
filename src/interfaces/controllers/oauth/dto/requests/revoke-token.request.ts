import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class RevokeTokenRequest {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsOptional()
    @IsString()
    @IsIn(['access_token', 'refresh_token'], {
        message: 'token_type_hint must be either "access_token" or "refresh_token"',
    })
    token_type_hint?: string;

    @IsString()
    @IsNotEmpty()
    client_id: string;

    @IsOptional()
    @IsString()
    client_secret?: string;
}

import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class TokenRequest {
    @IsString()
    @IsIn(['authorization_code', 'refresh_token', 'client_credentials'], {
        message: 'grant_type must be one of: authorization_code, refresh_token, client_credentials',
    })
    grant_type: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsString()
    @IsNotEmpty()
    client_id: string;

    @IsOptional()
    @IsString()
    client_secret?: string;

    @IsOptional()
    @IsString()
    redirect_uri?: string;

    @IsOptional()
    @IsString()
    refresh_token?: string;

    @IsOptional()
    @IsString()
    code_verifier?: string;
}


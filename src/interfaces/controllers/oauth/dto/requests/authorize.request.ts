import { IsString, IsNotEmpty, IsOptional, IsIn, IsUrl } from 'class-validator';

export class AuthorizeRequest {
    @IsString()
    @IsIn(['code', 'token'], { message: 'response_type must be either "code" or "token"' })
    response_type: string;

    @IsString()
    @IsNotEmpty()
    client_id: string;

    @IsString()
    @IsNotEmpty()
    redirect_uri: string;

    @IsOptional()
    @IsString()
    scope?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    code_challenge?: string;

    @IsOptional()
    @IsString()
    @IsIn(['plain', 'S256'], { message: 'code_challenge_method must be either "plain" or "S256"' })
    code_challenge_method?: string;
}


import { IsString, IsArray, IsOptional, IsUrl } from 'class-validator';

export class CreateClientRequest {

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    @IsUrl({ require_tld: false }, { each: true })
    redirectUris: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    grantTypes?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    scope?: string[];

    @IsOptional()
    @IsUrl({ require_tld: false })
    websiteUrl?: string;

    @IsOptional()
    @IsUrl({ require_tld: false })
    logoUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    contacts?: string[];
}

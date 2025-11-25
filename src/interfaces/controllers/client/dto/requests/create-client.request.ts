import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

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
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  logoUrl?: string;
}

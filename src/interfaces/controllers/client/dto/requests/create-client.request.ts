import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateClientRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  website_url?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  logo_url?: string;
}

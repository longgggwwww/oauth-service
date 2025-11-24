// src/interfaces/controllers/client/dto/requests/update-client.request.ts
import {
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateClientRequest {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  @IsOptional()
  redirectUris?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scope?: string[];

  @IsUrl({ require_tld: false })
  @IsOptional()
  websiteUrl?: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  logoUrl?: string;
}

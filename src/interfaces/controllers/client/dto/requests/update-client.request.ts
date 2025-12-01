// src/interfaces/controllers/client/dto/requests/update-client.request.ts
import {
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateClientRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  @IsOptional()
  redirect_uris?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scope?: string[];

  @IsUrl({ require_tld: false })
  @IsOptional()
  website_url?: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  logo_url?: string;
}

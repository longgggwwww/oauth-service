import { IsString, IsArray, IsOptional, IsUrl, IsUUID } from 'class-validator';

export class RegisterClientRequest {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  redirect_uris: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grant_types?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scope?: string[];

  @IsOptional()
  @IsUrl()
  website_url?: string;

  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contacts?: string[];
}

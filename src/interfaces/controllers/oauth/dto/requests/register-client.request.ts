import { IsString, IsArray, IsOptional, IsUrl, IsUUID } from 'class-validator';

export class RegisterClientRequest {
  @IsUUID()
  userId: string;

  @IsString()
  clientId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsUrl({}, { each: true })
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
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contacts?: string[];
}

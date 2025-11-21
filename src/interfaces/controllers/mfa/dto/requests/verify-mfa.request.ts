import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyMfaRequest {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsOptional()
    @IsString()
    secret?: string; // For initial verification
}

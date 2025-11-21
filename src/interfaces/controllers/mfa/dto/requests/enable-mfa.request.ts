import { IsString, IsIn, IsOptional, ValidateIf } from 'class-validator';

export class EnableMfaRequest {
    @IsString()
    @IsIn(['totp', 'sms'], { message: 'type must be either "totp" or "sms"' })
    type: 'totp' | 'sms';

    @ValidateIf((o) => o.type === 'sms')
    @IsString()
    phoneNumber?: string;
}

export class UserInfoResponse {
    sub: string;
    email?: string;
    email_verified?: boolean;
    phone_number?: string;
    phone_number_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    preferred_username?: string;
    locale?: string;
    updated_at?: number;
}

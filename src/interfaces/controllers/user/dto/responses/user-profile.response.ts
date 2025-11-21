import { UserProfileEntity } from '@src/core/domain/entities/user-profile.entity';

export class UserProfileResponse {
    id: string;
    userId: string;
    givenName?: string;
    familyName?: string;
    picture?: string;
    avatarUrl?: string;
    locale?: string;
    timezone?: string;
    birthDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    static fromEntity(entity: UserProfileEntity): UserProfileResponse {
        const response = new UserProfileResponse();
        response.id = entity.id;
        response.userId = entity.userId;
        response.givenName = entity.givenName;
        response.familyName = entity.familyName;
        response.picture = entity.picture;
        response.avatarUrl = entity.avatarUrl;
        response.locale = entity.locale;
        response.timezone = entity.timezone;
        response.birthDate = entity.birthDate;
        response.createdAt = entity.createdAt;
        response.updatedAt = entity.updatedAt;
        return response;
    }
}

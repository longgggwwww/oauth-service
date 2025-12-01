import { UserProfileEntity } from '@src/core/domain/entities/user-profile.entity';

export class UserProfileResponse {
  id: string;
  user_id: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  avatar_url?: string;
  locale?: string;
  timezone?: string;
  birth_date?: Date;
  created_at: Date;
  updated_at: Date;

  static fromEntity(entity: UserProfileEntity): UserProfileResponse {
    const response = new UserProfileResponse();
    response.id = entity.id;
    response.user_id = entity.userId;
    response.given_name = entity.givenName;
    response.family_name = entity.familyName;
    response.picture = entity.picture;
    response.avatar_url = entity.avatarUrl;
    response.locale = entity.locale;
    response.timezone = entity.timezone;
    response.birth_date = entity.birthDate;
    response.created_at = entity.createdAt;
    response.updated_at = entity.updatedAt;
    return response;
  }
}

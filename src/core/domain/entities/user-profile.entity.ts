export class UserProfileEntity {
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

    constructor(
        id: string,
        userId: string,
        createdAt: Date,
        updatedAt: Date,
        givenName?: string,
        familyName?: string,
        picture?: string,
        avatarUrl?: string,
        locale?: string,
        timezone?: string,
        birthDate?: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.givenName = givenName;
        this.familyName = familyName;
        this.picture = picture;
        this.avatarUrl = avatarUrl;
        this.locale = locale;
        this.timezone = timezone;
        this.birthDate = birthDate;
    }

    static create(userId: string): UserProfileEntity {
        return new UserProfileEntity(
            crypto.randomUUID(),
            userId,
            new Date(),
            new Date(),
        );
    }
}

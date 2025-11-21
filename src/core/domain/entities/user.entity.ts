export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING = 'PENDING',
}

export class UserEntity {
    id: string;
    email: string;
    phoneNumber?: string;
    passwordHash?: string;
    username?: string;
    emailVerified: boolean;
    phoneNumberVerified: boolean;
    status: UserStatus;
    mfaEnabled: boolean;
    mfaSecret?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        email: string,
        status: UserStatus,
        emailVerified: boolean,
        phoneNumberVerified: boolean,
        mfaEnabled: boolean,
        createdAt: Date,
        updatedAt: Date,
        phoneNumber?: string,
        passwordHash?: string,
        username?: string,
        mfaSecret?: string,
        lastLoginAt?: Date,
    ) {
        this.id = id;
        this.email = email;
        this.status = status;
        this.emailVerified = emailVerified;
        this.phoneNumberVerified = phoneNumberVerified;
        this.mfaEnabled = mfaEnabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.phoneNumber = phoneNumber;
        this.passwordHash = passwordHash;
        this.username = username;
        this.mfaSecret = mfaSecret;
        this.lastLoginAt = lastLoginAt;
    }

    static create(email: string, username?: string, phoneNumber?: string): UserEntity {
        return new UserEntity(
            crypto.randomUUID(),
            email,
            UserStatus.PENDING,
            false,
            false,
            false,
            new Date(),
            new Date(),
            phoneNumber,
            undefined,
            username,
        );
    }
}


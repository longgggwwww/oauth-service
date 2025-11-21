export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export class UserEntity {
    id: string;
    email: string;
    phoneNumber?: string;
    status: UserStatus;
    createdViaClientId?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        email: string,
        status: UserStatus,
        createdAt: Date,
        updatedAt: Date,
        phoneNumber?: string,
        createdViaClientId?: string,
    ) {
        this.id = id;
        this.email = email;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.phoneNumber = phoneNumber;
        this.createdViaClientId = createdViaClientId;
    }

    static create(
        email: string,
        phoneNumber?: string,
        createdViaClientId?: string,
    ): UserEntity {
        return new UserEntity(
            crypto.randomUUID(),
            email,
            UserStatus.PENDING_VERIFICATION,
            new Date(),
            new Date(),
            phoneNumber,
            createdViaClientId,
        );
    }
}

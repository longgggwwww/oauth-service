export class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainException';
    }
}

export class InvalidCredentialsException extends DomainException {
    constructor() {
        super('Invalid credentials');
        this.name = 'InvalidCredentialsException';
    }
}

export class UserNotFoundException extends DomainException {
    constructor(email: string) {
        super(`User with email ${email} not found`);
        this.name = 'UserNotFoundException';
    }
}

export class UserNotActiveException extends DomainException {
    constructor(email: string) {
        super(`User with email ${email} is not active`);
        this.name = 'UserNotActiveException';
    }
}

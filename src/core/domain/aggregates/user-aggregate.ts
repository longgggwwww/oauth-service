export class UserAggregate {
  id: string;
  email: string;
  passwordHash?: string;
  username?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

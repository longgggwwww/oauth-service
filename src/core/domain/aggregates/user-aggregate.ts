import { UserStatus } from '../entities/user.entity';

export class UserAggregate {
  id: string;
  email: string;
  phoneNumber?: string;
  status: UserStatus;
  createdViaClientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

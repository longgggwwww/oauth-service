import { UserAggregate } from '../../../domain/aggregates/user-aggregate';

export interface UserRepositoryPort {
  findById(id: string): Promise<UserAggregate | null>;
}

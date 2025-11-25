export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly fullName: string,
    public readonly password: string,
    public readonly givenName?: string,
    public readonly familyName?: string,
    public readonly picture?: string,
    public readonly avatarUrl?: string,
    public readonly locale?: string,
    public readonly timezone?: string,
    public readonly birthDate?: string,
  ) {}
}

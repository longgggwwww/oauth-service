export class RegisterClientCommand {
  constructor(
    public readonly userId: string,
    public readonly clientId: string,
    public readonly name: string,
    public readonly redirectUris: string[],
    public readonly description?: string,
    public readonly grantTypes?: string[],
    public readonly scope?: string[],
    public readonly websiteUrl?: string,
    public readonly logoUrl?: string,
    public readonly contacts?: string[],
  ) {}
}

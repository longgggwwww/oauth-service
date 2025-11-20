// src/core/application/use-cases/client/commands/delete-client.command.ts
export class DeleteClientCommand {
  constructor(
    public readonly clientId: string,
    public readonly userId: string,
  ) {}
}

// src/core/application/use-cases/client/commands/delete-many-clients.command.ts
export class DeleteManyClientsCommand {
  constructor(
    public readonly clientIds: string[],
    public readonly userId?: string,
  ) {}
}

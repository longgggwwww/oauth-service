// src/core/application/use-cases/client/commands/update-client.command.ts
import { UpdateClientRequest } from '@src/interfaces/controllers/client/dto/requests/update-client.request';

export class UpdateClientCommand {
  constructor(
    public readonly clientId: string,
    public readonly userId: string,
    public readonly updateDto: UpdateClientRequest,
  ) {}
}

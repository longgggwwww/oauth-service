// src/core/application/use-cases/client/queries/get-client.query.ts
export class GetClientQuery {
  constructor(
    public readonly clientId: string,
    public readonly userId: string,
  ) {}
}

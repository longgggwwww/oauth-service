// src/core/domain/events/client-registered.event.ts
export class ClientRegisteredEvent {
  constructor(
    public readonly clientId: string,
    public readonly ownerId: string,
    public readonly appName: string,
  ) {}
}

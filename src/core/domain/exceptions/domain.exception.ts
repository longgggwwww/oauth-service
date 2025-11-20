export class DomainException extends Error {}

export class ClientNotFoundException extends DomainException {
  constructor(message: string = 'Client not found') {
    super(message);
    this.name = 'ClientNotFoundException';
  }
}

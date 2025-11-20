export interface TokenRepositoryPort {
  revokeAllClientTokens(clientId: string): Promise<void>;
}

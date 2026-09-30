export class AIProviderError extends Error {
  constructor(public readonly details: { provider: string; statusCode?: number; providerStatus?: string; reason: string; retryable: boolean; retryAfterMs?: number; safeMessage: string }) {
    super(details.safeMessage); this.name = 'AIProviderError';
  }
}

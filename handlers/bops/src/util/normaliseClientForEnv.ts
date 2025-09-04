/**
 * Converts a client identifier (e.g., "camden-council")
 * into the format needed for environment variables (e.g., "CAMDEN_COUNCIL").
 */
export function normaliseClientForEnv(clientIdentifier: string): string {
  return clientIdentifier.replace(/-/g, '_').toUpperCase()
}

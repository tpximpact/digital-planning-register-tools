function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`${name} environment variable must be set`);
  }
  return value;
}

const apiKey = getEnvVar('API_KEY');

if (!apiKey) {
  throw new Error('API_KEY environment variable must be set');
}

const environment = getEnvVar('NODE_ENV', 'development');
const port = parseInt(getEnvVar('PORT', '4000'), 10);

const rateLimitEnv = process.env.RATE_LIMIT;
const rateLimit =
  rateLimitEnv !== undefined && rateLimitEnv !== ''
    ? parseInt(rateLimitEnv, 10)
    : 100;

export default {
  environment,
  port,
  rateLimit,
  apiKey,
};

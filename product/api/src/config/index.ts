const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable must be set');
}

export default {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  rateLimit: process.env.RATE_LIMIT
    ? parseInt(process.env.RATE_LIMIT, 10)
    : 100,
  apiKey,
};

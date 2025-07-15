const apiKey = process.env.API_KEY;
if (apiKey === undefined || apiKey === null || apiKey === '') {
  throw new Error('API_KEY environment variable must be set');
}

const nodeEnv = process.env.NODE_ENV;
const environment =
  nodeEnv !== undefined && nodeEnv !== null && nodeEnv !== ''
    ? nodeEnv
    : 'development';

const portEnv = process.env.PORT;
const port =
  portEnv !== undefined && portEnv !== null && portEnv !== ''
    ? parseInt(portEnv, 10)
    : 4000;

const rateLimitEnv = process.env.RATE_LIMIT;
const rateLimit =
  rateLimitEnv !== undefined && rateLimitEnv !== null && rateLimitEnv !== ''
    ? parseInt(rateLimitEnv, 10)
    : 100;

export default {
  environment,
  port,
  rateLimit,
  apiKey,
};

// const apiKey = process.env.API_KEY
// if (!apiKey) {
//   throw new Error('API_KEY environment variable must be set')
// }

export default {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  rateLimitMax: process.env.RATE_LIMIT_MAX
    ? parseInt(process.env.RATE_LIMIT_MAX, 10)
    : 10,
  rateLimitDuration: process.env.RATE_LIMIT_DURATION
    ? parseInt(process.env.RATE_LIMIT_DURATION, 10)
    : 60000
  // apiKey
}

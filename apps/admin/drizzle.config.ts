import { defineConfig } from 'drizzle-kit'
import { ENV_ADMIN as env } from '@dpr/config'

const { DATABASE_URL } = env

export default defineConfig({
  out: './migrations',
  schema: './src/db',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL
  },
  verbose: true,
  strict: true,
  casing: 'snake_case'
})

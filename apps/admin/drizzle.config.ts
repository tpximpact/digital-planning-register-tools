import { defineConfig } from 'drizzle-kit'
import { env } from '@dpr/libs'

export default defineConfig({
  out: './migrations',
  schema: './src/db',
  dialect: 'postgresql',
  dbCredentials: {
    url: env?.DATABASE_URL ?? ''
  },
  verbose: true,
  strict: true,
  casing: 'snake_case'
})

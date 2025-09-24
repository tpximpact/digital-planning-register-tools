import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './migrations',
  schema: './src/db',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env?.DATABASE_URL ?? ''
  },
  verbose: true,
  strict: true,
  casing: 'snake_case'
})

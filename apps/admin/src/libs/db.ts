import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import path from 'node:path'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import * as clientsSchema from '../db/clients'

// Merge all schemas
const schema = {
  ...clientsSchema
}

// Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
const globalForDb = globalThis as unknown as {
  drizzle: NodePgDatabase<typeof schema>
}

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate
const createDbConnection = () => {
  return drizzle({
    connection: {
      connectionString: process.env?.DATABASE_URL ?? '',
      ssl:
        process.env?.DATABASE_URL?.includes('localhost') &&
        process.env?.DATABASE_URL?.includes('127.0.0.1')
    },
    schema,

    casing: 'snake_case'
  })
}

const db = globalForDb.drizzle || createDbConnection()

// Only store in global during development to prevent hot reload issues
if (process.env?.NODE_ENV !== 'production') {
  globalForDb.drizzle = db
}

await migrate(db, {
  migrationsFolder: path.join(process.cwd(), 'migrations')
})

export { db }

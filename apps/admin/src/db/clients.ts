import { varchar, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-typebox'

export const clients = pgTable('clients', {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  slug: varchar(),
  endpoint: varchar().notNull(),
  lastPolledAt: timestamp({ mode: 'date' }),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp({ mode: 'date' }).defaultNow().notNull()
})

export const clientSelectSchema = createSelectSchema(clients)

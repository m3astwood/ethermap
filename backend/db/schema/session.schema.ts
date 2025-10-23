import { json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const sessions = pgTable('sessions', {
  sid: varchar().notNull().primaryKey(),
  sess: json(),
  expired: timestamp(),
})

export const sessionSchema = createSelectSchema(sessions)

export const sessionUserSchema = z.object({
  name: z.string(),
  colour: z.string()
})

export type SessionsSchema = typeof sessions

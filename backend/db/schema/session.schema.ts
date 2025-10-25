import { relations } from 'drizzle-orm'
import { json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { mapSessions } from './mapSession.schema'

export const sessions = pgTable('sessions', {
  sid: varchar().notNull().primaryKey(),
  sess: json(),
  expired: timestamp(),
  name: varchar(),
  colour: varchar(),
})

export const mapSessionRelations = relations(sessions, ({ many }) => ({
  mapSessions: many(mapSessions)
}))

export const sessionSchema = createSelectSchema(sessions)
export const sessionUserSchema = z.object({
  name: z.string(),
  colour: z.string()
})

export type SessionsSchema = typeof sessionSchema

import { json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const sessions = pgTable('sessions', {
  sid: varchar().notNull().primaryKey(),
  sess: json(),
  expired: timestamp(),
})

export type SessionsTable = typeof sessions

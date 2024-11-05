import { relations } from 'drizzle-orm'
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

import { points } from './point.schema'

export const maps = pgTable('maps', {
  id: serial().primaryKey(),
  name: varchar().unique().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const mapRelations = relations(maps, ({ many }) => ({
  mapPoints: many(points)
}))

export const selectMapSchema = createSelectSchema(maps)
export const insertMapSchema = createInsertSchema(maps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

import { relations } from 'drizzle-orm'
import { integer, json, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { sessions } from './session.schema'
import { z } from 'zod'
import { maps } from './map.schema'

export const points = pgTable('points', {
  id: serial().primaryKey(),
  name: varchar(),
  notes: varchar(),
  location: json().$type<{ lat: number; lng: number }>().notNull(),
  mapId: integer().notNull(),
  createdBy: varchar(),
  createdAt: timestamp().defaultNow(),
  updatedBy: varchar(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const pointRelations = relations(points, ({ one }) => ({
  mapId: one(maps, {
    fields: [points.mapId],
    references: [maps.id]
  }),
  createdBy: one(sessions, {
    fields: [points.createdBy],
    references: [sessions.sid],
  }),
  updatedBy: one(sessions, {
    fields: [points.updatedBy],
    references: [sessions.sid],
  }),
}))

export const selectPointSchema = createSelectSchema(points)
export const insertPointSchema = createInsertSchema(points).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updatedBy: true,
})

export type PointSchema = z.infer<typeof selectPointSchema>

import { relations } from 'drizzle-orm'
import { integer, json, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { locationSchema } from './location.schema'
import { maps } from './map.schema'
import { sessionSchema, sessions } from './session.schema'

export const points = pgTable('points', {
  id: serial().primaryKey(),
  name: varchar(),
  notes: varchar(),
  location: json().$type<{ lat: number; lng: number }>().notNull(),
  mapId: integer().notNull(),
  createdById: varchar(),
  createdAt: timestamp().defaultNow(),
  updatedById: varchar(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const pointRelations = relations(points, ({ one }) => ({
  map: one(maps, {
    fields: [points.mapId],
    references: [maps.id],
  }),
  createdBy: one(sessions, {
    fields: [points.createdById],
    references: [sessions.sid],
  }),
  updatedBy: one(sessions, {
    fields: [points.updatedById],
    references: [sessions.sid],
  }),
}))

export const selectPointSchema = createSelectSchema(points).safeExtend({
  location: locationSchema,
})

export const selectPointSchemaWithUsers = createSelectSchema(points).safeExtend({
  location: locationSchema,
  createdBy: sessionSchema.nullable(),
  updatedBy: sessionSchema.nullable(),
})

export const insertPointSchema = createInsertSchema(points)
  .safeExtend({
    location: locationSchema,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    updatedBy: true,
  })

export const patchPointSchema = selectPointSchema
  .safeExtend({
    location: locationSchema,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

export type SelectPointSchema = z.infer<typeof selectPointSchema>
export type InsertPointSchema = z.infer<typeof insertPointSchema>
export type PatchPointSchema = z.infer<typeof patchPointSchema>

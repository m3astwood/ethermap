import { integer, json, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { locationSchema } from './location.schema'
import { maps } from './map.schema'
import { sessions } from './session.schema'
import z from 'zod'

export const mapSessions = pgTable(
  'map_session',
  {
    sid: varchar()
      .notNull()
      .references(() => sessions.sid),
    mapId: integer()
      .notNull()
      .references(() => maps.id),
    lastLocation: json().$type<{ lat: number; lng: number }>().notNull(),
    zoom: integer().notNull(),
  },
  (table) => [primaryKey({ columns: [table.sid, table.mapId] })],
)

export const selectMapSessionSchema = createSelectSchema(mapSessions).extend({
  location: locationSchema,
})
export const insertMapSessionSchema = createInsertSchema(mapSessions).extend({
  location: locationSchema,
})
export const updateMapSessionSchema = insertMapSessionSchema.partial()

export type SelectMapSessionSchema = z.infer<typeof selectMapSessionSchema>
export type InsertMapSessionSchema = z.infer<typeof insertMapSessionSchema>
export type UpdateMapSessionSchema = z.infer<typeof updateMapSessionSchema>

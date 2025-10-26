import { integer, json, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type z from 'zod'
import { locationSchema } from './location.schema'
import { maps } from './map.schema'
import { sessions } from './session.schema'
import { relations } from 'drizzle-orm'

export const mapSessions = pgTable(
  'map_session',
  {
    sid: varchar().notNull(),
    mapId: integer().notNull(),
    lastLocation: json().$type<{ lat: number; lng: number }>().notNull(),
    zoom: integer().notNull(),
  },
  (table) => [primaryKey({ columns: [table.sid, table.mapId] })],
)

export const sessionRelation = relations(mapSessions, ({ one }) => ({
  user: one(sessions, {
    fields: [mapSessions.sid],
    references: [sessions.sid],
    relationName: 'userSession'
  }),
  map: one(maps, {
    fields: [mapSessions.mapId],
    references: [maps.id]
  })
}))

export const selectMapSessionSchema = createSelectSchema(mapSessions).extend({
  location: locationSchema,
})
export const insertMapSessionSchema = createInsertSchema(mapSessions)
  .extend({
    lastLocation: locationSchema,
  })
  .omit({
    sid: true,
  })
export const updateMapSessionSchema = insertMapSessionSchema.partial()

export type SelectMapSessionSchema = z.infer<typeof selectMapSessionSchema>
export type InsertMapSessionSchema = z.infer<typeof insertMapSessionSchema>
export type UpdateMapSessionSchema = z.infer<typeof updateMapSessionSchema>

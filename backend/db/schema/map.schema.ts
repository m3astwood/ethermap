import { relations } from 'drizzle-orm'
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'

import { points, selectPointSchema } from './point.schema'

export const maps = pgTable('maps', {
  id: serial().primaryKey(),
  name: varchar().unique().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const mapRelations = relations(maps, ({ many }) => ({
  mapPoints: many(points),
}))

export const selectMapSchema = createSelectSchema(maps)
export const insertMapSchema = createInsertSchema(maps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const selectMapWithPointsSchema = createSelectSchema(maps).safeExtend({
  mapPoints: z.array(selectPointSchema)
})

export const patchMapSchema = insertMapSchema.partial()

export type SelectMapSchema = z.infer<typeof selectMapSchema>
export type SelectMapWithPointsSchema = z.infer<typeof selectMapWithPointsSchema>
export type InsertMapSchema = z.infer<typeof insertMapSchema>
export type PatchMapSchema = z.infer<typeof patchMapSchema>

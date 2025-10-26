import { eq } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { beforeAll, describe, expect, it } from 'vitest'

import db from '../db'
import { points } from '../db/schema/index'
import { maps } from '../db/schema/map.schema'

describe.sequential('Database Tests', () => {
  beforeAll(async () => {
    await migrate(db, { migrationsFolder: './backend/db/migrations/' })
  })

  it('should return array of maps when querying all maps', async () => {
    const maps = await db.query.maps.findMany()

    expect(maps).toBeTruthy()
  })

  it('should return map object when inserting a new map', async () => {
    const [map] = await db.insert(maps).values({ name: 'milo' }).returning()

    expect(map.name).toEqual('milo')
  })

  it('should returns point on inserting point for existing map', async () => {
    const [point] = await db
      .insert(points)
      .values({ mapId: 1, name: 'pointy', location: { lat: 50.8552, lng: 4.3454 } })
      .returning()

    const map = await db.query.maps.findFirst({
      where: eq(maps.name, 'milo'),
      with: {
        mapPoints: true,
      },
    })

    expect(point?.name).toEqual('pointy')
    expect(point?.location).toEqual({ lat: 50.8552, lng: 4.3454 })
  })
})

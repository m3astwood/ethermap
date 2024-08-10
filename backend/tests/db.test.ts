import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

import { DB } from '../db/DB'
import MapModel from '../db/models/map'

describe('Database Tests', () => {
  beforeAll(async () => {
    await DB.migrate.latest()
  })

  afterAll(async () => {
    await DB.migrate.rollback({}, true)
  })

  it('should return array of maps when querying all maps', async () => {
    const maps = await MapModel.query()

    expect(maps).toBeTruthy()
  })

  it('should return map object when inserting a new map', async () => {
    const map = await MapModel.query().insert({ name: 'milo' })

    expect(map.name).toEqual('milo')
  })

  it('should returns point on inserting point for existing map', async () => {
    const map = await MapModel.query().where({ name: 'milo' }).first()
    const point = await map?.$relatedQuery('map_points').insert({
      name: 'pointy',
      location: { lat: 50.8552, lng: 4.3454 },
    })

    expect(point?.name).toEqual('pointy')
    expect(point?.location).toEqual({ lat: 50.8552, lng: 4.3454 })
  })
})

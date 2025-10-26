// testing tools
import { migrate } from 'drizzle-orm/pglite/migrator'
import { testClient } from 'hono/testing'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

// hono app
import { app } from '@/backend/app'

// test agent (single request for all tests)
let client

// db
import db from '@/backend/db'

describe.sequential('Map routes', () => {
  beforeAll(async () => {
    await migrate(db, { migrationsFolder: './backend/db/migrations' })
  })

  beforeEach(() => {
    client = testClient(app)
  })

  it('should return an object containing an array called "maps" on GET "/api/maps" route', async () => {
    const res = await client.api.maps.$get()
    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body.maps?.constructor).toEqual(Array)
  })

  it('should return new map with matching name and status 201 on GET "/api/map/:mapName" route to new mapName', async () => {
    const res = await client.api.maps[':name'].$get({
      param: {
        name: 'bingo',
      },
    })
    const body = await res.json()

    expect(res.status).toEqual(201)
    expect(body.name).toEqual('bingo')
  })

  it('should return same id with status 200 on GET "/api/map/:mapName" route to existing mapName', async () => {
    const res = await client.api.maps[':name'].$get({
      param: {
        name: 'bingo',
      },
    })
    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body.id).toEqual(1)
  })

  it('should return a map with an array of points with status 200 on GET "/api/map/:mapName"', async () => {
    const mapRes = await client.api.maps[':name'].$get({
      param: {
        name: 'bingo',
      },
    })
    const { id: mapId } = await mapRes.json()

    await client.api.points.$post({
      json: {
        name: 'pointy',
        location: { lat: 50.8552, lng: 4.3454 },
        mapId,
      },
    })

    const res = await client.api.maps[':name'].$get({
      param: {
        name: 'bingo',
      },
    })

    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body.mapPoints).toBeTruthy()
    expect(body.mapPoints.length).toEqual(1)
  })
})

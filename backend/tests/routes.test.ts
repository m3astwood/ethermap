// testing tools
import { migrate } from 'drizzle-orm/pglite/migrator'
import { testClient } from 'hono/testing'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

// hono app
import { app } from '../httpServer'

// test agent (single request for all tests)
let client

// db
import db from '../db'

describe.sequential('Routes tests', () => {
  // test setup
  beforeAll(async () => {
    await migrate(db, { migrationsFolder: './backend/db/migrations' })
  })

  beforeEach(() => {
    client = testClient(app)
  })

  // tests
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

  it('should return a point with status 201 on POST "/api/point" body containing a name, location and map_id', async () => {
    const mapRes = await client.api.maps[':name'].$get({
      param: {
        name: 'bingo',
      },
    })

    const { id: mapId } = await mapRes.json()

    const res = await client.api.points.$post({
      json: {
        mapId,
        point: {
          name: 'pointy',
          location: { lat: 50.8552, lng: 4.3454 },
        },
      },
    })

    const body = await res.json()

    expect(res.status).toEqual(201)
    expect(body.id).toEqual(1)
    expect(body.mapId).toEqual(mapId)
    expect(body.location).toEqual({ lat: 50.8552, lng: 4.3454 })
    expect(body.name).toEqual('pointy')
  })

  it('should return a map with an array of points with status 200 on GET "/api/map/:mapName"', async () => {
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

  it('should throw 400 error on POST "/api/point" with incorrect data keys', async () => {
    const mapRes = await client.api.maps[':name'].$get({
      param: {
        name: 'bingo',
      },
    })
    const { id: mapId } = await mapRes.json()

    const error = await client.api.points.$post({
      json: {
        mapId,
        point: {
          title: 'pointy',
          coords: '(50.8552,4.3454)',
        },
      },
    })

    expect(error.status).toEqual(400)
  })

  it('should return new point object with status 201 on PUT "/api/point/:id" with valid data', async () => {
    const json = { point: { name: 'very pointy' } }
    const res = await client.api.points[':id'].$put({
      param: { id: 1 },
      json,
    })

    const body = await res.json()

    expect(res.status).toEqual(201)
    expect(body.name).toEqual('very pointy')
  })

  it('should throw 404 error on PUT "/api/point/:id" with invalid id', async () => {
    const json = { point: { name: 'dull' } }
    const res = await client.api.points[':id'].$put({
      param: { id: 100 },
      json,
    })

    expect(res.status).toEqual(404)
  })

  it('should return an array of all points associated with map and status of 200 on GET "/api/points/map/:map_id"', async () => {
    const res = await client.api.points.map[':map_id'].$get({
      param: {
        map_id: 1
      }
    })
    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body.points?.constructor).toEqual(Array)
    expect(body.points[0].name).toEqual('very pointy')
  })

  it('should throw a 404 error on GET "/api/points/map/:map_id" with invalid id', async () => {
    const res = await client.api.points.map[':map_id'].$get({
      param: {
        map_id: 100
      }
    })

    expect(res.status).toEqual(404)
  })

  it('should throw 404 error on DELETE "/api/point/:id" with invalid id', async () => {
    const res = await client.api.points[':id'].$delete({
      param: { id: 100 },
    })

    expect(res.status).toEqual(404)
  })

  it('should returns 200 status DELETE "/api/point/:id" with valid id', async () => {
    const res = await client.api.points[':id'].$delete({
      param: { id: 1 },
    })

    expect(res.status).toEqual(200)
  })
})

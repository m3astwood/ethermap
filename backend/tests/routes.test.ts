// testing tools
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { migrate } from 'drizzle-orm/pglite/migrator'
import request, { type Agent } from 'supertest'

// express app
import { app } from '../httpServer'

// test agent (single request for all tests)
let agent: Agent

// db
import db, { type Db } from '../db'

describe.sequential('Routes tests', () => {
  // test setup
  beforeAll(async () => {
    await migrate(db, { migrationsFolder: './backend/db/migrations'})
  })

  beforeEach(() => {
    agent = request.agent(app)
  })

  // tests
  it('should return an object containing an array called "maps" on GET "/api/maps" route', async () => {
    const res = await agent.get('/api/maps')

    expect(res.status).toEqual(200)
    expect(res.body.maps?.constructor).toEqual(Array)
  })

  it('should return new map with matching name and status 201 on GET "/api/map/:mapName" route to new mapName', async () => {
    const res = await agent.get('/api/map/bingo')

    expect(res.status).toEqual(201)
    expect(res.body.name).toEqual('bingo')
  })

  it('should return same id with status 200 on GET "/api/map/:mapName" route to existing mapName', async () => {
    const res = await agent.get('/api/map/bingo')

    expect(res.status).toEqual(200)
    expect(res.body.id).toEqual(1)
  })

  it('should return a point with status 201 on POST "/api/point" body containing a name, location and map_id', async () => {
    const {
      body: {
        id: mapId,
      },
    } = await agent.get('/api/map/bingo')
    const res = await agent.post('/api/point').send({
      mapId,
      point: {
        name: 'pointy',
        location: { lat: 50.8552, lng: 4.3454 },
      },
    })

    expect(res.status).toEqual(201)
    expect(res.body.id).toEqual(1)
    expect(res.body.mapId).toEqual(mapId)
    expect(res.body.location).toEqual({ lat: 50.8552, lng: 4.3454 })
    expect(res.body.name).toEqual('pointy')
  })

  it('should return a map with an array of points with status 200 on GET "/api/map/:mapName"', async () => {
    const res = await agent.get('/api/map/bingo')

    expect(res.status).toEqual(200)
    expect(res.body.mapPoints).toBeTruthy()
    expect(res.body.mapPoints.length).toEqual(1)
  })

  it('should throw 400 error on POST "/api/point" with incorrect data keys', async () => {
    const {
      body: {
        id: mapId,
      },
    } = await agent.get('/api/map/bingo')
    const error = await agent.post('/api/point').send({
      mapId,
      point: {
        title: 'pointy',
        coords: '(50.8552,4.3454)',
      },
    })

    expect(error.status).toEqual(400)
  })

  it('should return new point object with status 201 on PUT "/api/point/:id" with valid data', async () => {
    const body = { point: { name: 'very pointy' } }
    const res = await agent.put('/api/point/1').send(body)

    expect(res.status).toEqual(201)
    expect(res.body.name).toEqual('very pointy')
  })

  it('should throw 404 error on PUT "/api/point/:id" with invalid id', async () => {
    const body = { point: { name: 'dull' } }
    const res = await agent.put('/api/point/100').send(body)

    expect(res.status).toEqual(404)
  })

  it('should return an array of all points associated with map and status of 200 on GET "/api/map/:id/points"', async () => {
    const res = await agent.get('/api/map/1/points')

    expect(res.status).toEqual(200)
    expect(res.body.points?.constructor).toEqual(Array)
    expect(res.body.points[0].name).toEqual('very pointy')
  })

  it('should throw a 404 error on GET "/api/map/:id/points" with invalid id', async () => {
    const res = await agent.get('/api/map/100/points')

    expect(res.status).toEqual(404)
  })

  it('should throw 404 error on DELETE "/api/point/:id" with invalid id', async () => {
    const res = await agent.delete('/api/point/100')

    expect(res.status).toEqual(404)
  })

  it('should returns 200 status DELETE "/api/point/:id" with valid id', async () => {
    const res = await agent.delete('/api/point/1')

    expect(res.status).toEqual(200)
  })
})

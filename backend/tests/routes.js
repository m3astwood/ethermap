// testing tools
import test from 'ava'
import request from 'supertest'

// express app
import { app } from '../express.js'

// test agent
// (single request for all tests)
let agent

// db
import db from '../db/DB.js'

// test setup
test.before(async () => {
  await db.migrate.latest()

  agent = request.agent(app)
})

test.after(async () => {
  await db.migrate.down()
})

// tests
test.failing('get "/" route should return status code of 200', async (t) => {
  const res = await agent.get('/')

  t.is(res.status, 200)
})

test.serial(
  'get "/api/maps" route should return an object containing an array called "maps"',
  async (t) => {
    const res = await agent.get('/api/maps')

    t.is(res.status, 200)
    t.truthy(res.body.maps?.constructor === Array)
  },
)

test.serial(
  'get "/api/map/:mapName" route to new mapName should return new map with matching name and status 201',
  async (t) => {
    const res = await agent.get('/api/map/bingo')

    t.is(res.status, 201)
    t.is(res.body.map.name, 'bingo')
  },
)

test.serial(
  'get "/api/map/:mapName" route to existing mapName should return same id with status 200',
  async (t) => {
    const res = await agent.get('/api/map/bingo')

    t.is(res.status, 200)
    t.is(res.body.map.id, 1)
  },
)

test.serial(
  'post "/api/point" body containing a name, location and map_id should return a point with status 201',
  async (t) => {
    const {
      body: {
        map: { id: mapId },
      },
    } = await agent.get('/api/map/bingo')
    const res = await agent
      .post('/api/point')
      .send({
        mapId,
        point: {
          name: 'pointy',
          location: { lat: 50.8552, lng: 4.3454 },
        },
      })

    t.is(res.status, 201)
    t.is(res.body.id, 1)
    t.is(res.body.map_id, mapId)
    t.deepEqual(res.body.location, { lat: 50.8552, lng: 4.3454 })
    t.is(res.body.name, 'pointy')
  },
)

test.serial(
  'get "/api/map/:mapName" with points should return a map with an array of points with status 200',
  async (t) => {
    const res = await agent.get('/api/map/bingo')

    t.is(res.status, 200)
    t.truthy(res.body.points)
    t.is(res.body.points.length, 1)
  },
)

test.serial(
  'post "/api/point" with incorrect data keys throws 400 error',
  async (t) => {
    const {
      body: {
        map: { id: mapId },
      },
    } = await agent.get('/api/map/bingo')
    const error = await agent
      .post('/api/point')
      .send({
        mapId,
        point: {
          title: 'pointy',
          coords: '(50.8552,4.3454)',
        },
      })

    t.is(error.status, 400)
  },
)

test.serial(
  'update "/api/point/:id" with valid data will return new point object with status 201',
  async (t) => {
    const body = { point: { name: 'very pointy' } }
    const res = await agent.put('/api/point/1').send(body)

    t.is(res.status, 201)
    t.is(res.body.id, 1)
    t.is(res.body.name, 'very pointy')
  },
)

test.serial(
  'put "/api/point/:id" with invalid id throws 404 error',
  async (t) => {
    const body = { point: { name: 'dull' } }
    const res = await agent.put('/api/point/100').send(body)

    t.is(res.status, 404)
  },
)

test.serial(
  'get "/api/map/:id/points" will return an array of all points associated with map and status of 200',
  async (t) => {
    const res = await agent.get('/api/map/1/points')

    t.is(res.status, 200)
    t.truthy(res.body.points?.constructor === Array)
    t.is(res.body.points[0].name, 'very pointy')
  },
)

test.serial(
  'get "/api/map/:id/points" with invalid id throws a 404 error',
  async (t) => {
    const res = await agent.get('/api/map/100/points')

    t.is(res.status, 404)
  },
)

test.serial(
  'delete "/api/point/:id" with invalid id throws 404 error',
  async (t) => {
    const res = await agent.delete('/api/point/100')

    t.is(res.status, 404)
  },
)

test.serial(
  'delete "/api/point/:id" with valid id returns 200 status',
  async (t) => {
    const res = await agent.delete('/api/point/1')

    t.is(res.status, 200)
  },
)

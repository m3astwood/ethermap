// testing tools
import test from 'ava'
import request from 'supertest'

// express app
import App from '../express.js'
import db from '../db/DB.js'

test.before(async () => {
  await db.migrate.latest()
})

test.failing('get "/" route should return status code of 200', async t => {
  const res = await request(App).get('/')

  t.is(res.status, 200)
})

test.serial('get "/api/maps" route should return an object containing an array called "maps"', async t => {
  const res = await request(App).get('/api/maps')

  t.is(res.status, 200)
  t.truthy(res.body.maps?.constructor === Array)
})

test.serial('get "/api/map/:mapName" route should return map with matching name', async t => {
  const res = await request(App).get('/api/map/bingo')

  t.is(res.status, 200)
  t.is(res.body.name, 'bingo')
})

test.serial('get "/api/map/:mapName" route with different mapName should create new map with different id', async t => {
  const res = await request(App).get('/api/map/cheese')

  t.is(res.status, 200)
  t.truthy(res.body.id)
  t.not(res.body.id, 1)
})

test.serial('get "/api/map/:mapName" route with existing mapName should return same id', async t => {
  const res = await request(App).get('/api/map/bingo')

  t.is(res.status, 200)
  t.is(res.body.id, 1)
})

test.serial('post "/api/point/add" body containing a name, location and map_id should return a point', async t => {
  const { body: { id: mapId } } = await request(App).get('/api/map/bingo')
  const res = await request(App)
    .post('/api/point/add')
    .send({
      mapId,
      point: {
        name: 'pointy',
        location: '(50.8552,4.3454)',
      }
    })

  t.is(res.status, 200)
  t.is(res.body.id, 1)
  t.is(res.body.map_id, mapId)
  t.is(res.body.name, 'pointy')
})

test.serial('get "/api/map/:mapName" with associated points should return a map with an array of points', async t => {
  const res = await request(App).get('/api/map/bingo')

  t.is(res.status, 200)
  t.truthy(res.body.map_points)
  t.is(res.body.map_points.length, 1)
})

test.serial('post "/api/point/add" with incorrect data keys throws 500 error', async t => {
  const { body: { id: mapId } } = await request(App).get('/api/map/bingo')
  const error = await request(App)
    .post('/api/point/add')
    .send({
      mapId,
      point: {
        title: 'pointy',
        coords: '(50.8552,4.3454)',
      }
    })

  t.is(error.status, 500)
})

test.after(async () => {
  await db.migrate.down()
})

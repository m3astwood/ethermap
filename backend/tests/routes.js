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

test.serial('get "/api/map/:mapName" route to new mapName should return new map with matching name and status 201', async t => {
  const res = await request(App).get('/api/map/bingo')

  t.is(res.status, 201)
  t.is(res.body.name, 'bingo')
})

test.serial('get "/api/map/:mapName" route to existing mapName should return same id with status 200', async t => {
  const res = await request(App).get('/api/map/bingo')

  t.is(res.status, 200)
  t.is(res.body.id, 1)
})

test.serial('post "/api/point/add" body containing a name, location and map_id should return a point with status 201', async t => {
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

  t.is(res.status, 201)
  t.is(res.body.id, 1)
  t.is(res.body.map_id, mapId)
  t.is(res.body.name, 'pointy')
})

test.serial('get "/api/map/:mapName" with associated points should return a map with an array of points with status 200', async t => {
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

test.serial('update "/api/point/:id" with valid data will return new point object with status 201', async t => {
  const body = { point: { name: 'very pointy' } }
  const res = await request(App)
    .put('/api/point/1')
    .send(body)

  t.is(res.status, 201)
  t.is(res.body.id, 1)
  t.is(res.body.name, 'very pointy')
})  

test.serial('put "/api/point/:id" with invalid id throws 404 error', async t => {
  const body = { point: { name: 'dull' } }
  const res = await request(App)
    .put('/api/point/100')
    .send(body)

  t.is(res.status, 404)
})

test.serial('get "/api/map/:id/points" will return an array of all points associated with map and status of 200', async t => {
  const res = await request(App)
    .get('/api/map/1/points')

  t.is(res.status, 200)
  t.truthy(res.body.points?.constructor === Array)
  t.is(res.body.points[0].name, 'very pointy')
})

test.serial ('get "/api/map/:id/points" with invalid id throws a 404 error', async t => {
  const res = await request(App)
    .get('/api/map/100/points')

  t.is(res.status, 404)
})

test.serial('delete "/api/point/:id" with invalid id throws 404 error', async t => {
  const res = await request(App)
    .delete('/api/point/100')

  t.is(res.status, 404)
})

test.serial('delete "/api/point/:id" with valid id returns 200 status', async t => {
  const res = await request(App)
    .delete('/api/point/1')

  t.is(res.status, 200)
})

test.after(async () => {
  await db.migrate.down()
})

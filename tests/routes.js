// testing tools
import test from 'ava'
import request from 'supertest'

// express app
import App from '../server.js'
import db from '../db/DB.js'

test.before(async t => {
  await db.migrate.latest()
})

test.serial('get "/" route should return body of "ethermap"', async t => {
  const res = await request(App).get('/')

  t.is(res.status, 200)
  t.is(res.text, 'ethermap')
})

test.serial('get "/maps" route should return an object containing an array called "maps"', async t => {
  const res = await request(App).get('/maps')

  t.is(res.status, 200)
  t.truthy(res.body.maps?.constructor === Array)
})

test.serial('get "/m/:mapName" route should return map with matching name', async t => {
  const res = await request(App).get('/m/bingo')

  t.is(res.status, 200)
  t.is(res.body.name, 'bingo')
})

test.serial('get "/m/:mapName" route with different mapName should create new map with different id', async t => {
  const res = await request(App).get('/m/cheese')

  t.is(res.status, 200)
  t.truthy(res.body.id)
  t.not(res.body.id, 1)
})

test.serial('get "/m/:mapName" route with existing mapName should return same id', async t => {
  const res = await request(App).get('/m/bingo')

  t.is(res.status, 200)
  t.is(res.body.id, 1)
})

test.serial('post "/p/addpoint" body containing a name, location and map_id should return a point', async t => {
  const { body: { id: mapId } } = await request(App).get('/m/bingo')
  const res = await request(App)
    .post('/p/addpoint')
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

test.serial('get "/m/:mapName" with associated points should return a map with an array of points', async t => {
  const res = await request(App).get('/m/bingo')

  t.is(res.status, 200)
  t.truthy(res.body.map_points)
  t.is(res.body.map_points.length, 1)
})

test.serial('post "/p/addpoint" with incorrect data keys throws 500 error', async t => {
  const { body: { id: mapId } } = await request(App).get('/m/bingo')
  const error = await request(App)
    .post('/p/addpoint')
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


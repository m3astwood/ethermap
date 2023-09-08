// testing tools
import test from 'ava'
import db from '../db/DB.js'

// db model
import MapModel from '../db/models/map.js'

test.before(async () => {
  await db.migrate.latest()
})

test('Selecting maps should return array', async t => {
  const maps = await MapModel.query()

  t.truthy(maps)
})

test.serial('Inserting map returns map object', async t => {
  const map = await MapModel.query().insert({ name: 'milo' })

  t.is(map.name, 'milo')
})

test.serial('Insert point for existing map returns point', async t => {
  const map = await MapModel.query().where({ name: 'milo' }).first()
  const point = await map.$relatedQuery('map_points').insert({
    name: 'pointy',
    location: '(50.8552,4.3454)',
  })

  t.is(point.name, 'pointy')
  t.is(point.location, '(50.8552,4.3454)')
})

test.after(async () => {
  await db.migrate.down()
})

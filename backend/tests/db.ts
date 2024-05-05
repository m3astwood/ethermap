// testing tools
import test from 'ava'
import { DB } from '../db/DB'

// db model
import MapModel from '../db/models/map'

test.before(async () => {
  await DB.migrate.latest()
})

test.serial('Selecting maps should return array', async (t) => {
  const maps = await MapModel.query()

  t.truthy(maps)
})

test.serial('Inserting map returns map object', async (t) => {
  const map = await MapModel.query().insert({ name: 'milo' })

  t.is(map.name, 'milo')
})

test.serial('Insert point for existing map returns point', async (t) => {
  const map = await MapModel.query().where({ name: 'milo' }).first()
  const point = await map?.$relatedQuery('map_points').insert({
    name: 'pointy',
    location: { lat: 50.8552, lng: 4.3454 },
  })

  t.is(point?.name, 'pointy')
  t.deepEqual(point?.location, { lat: 50.8552, lng: 4.3454 })
})

test.after(async () => {
  await DB.migrate.rollback({}, true)
})

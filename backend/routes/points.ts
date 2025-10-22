import type UserSession from 'backend/interfaces/UserSession'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type { Session } from 'hono-sessions'
import db from '../db'
import { maps, points } from '../db/schema'
import { emitMapEvent } from '../utils/emitter'

const pointProdecures = new Hono<{
  Variables: {
    session: Session<{ user: UserSession }>
    session_key_rotation: boolean
  }
}>()
  .get('/:id', async (c) => {
    try {
      const { id } = c.req.param()
      const point = await db.query.points.findFirst({
        where: eq(points.id, Number.parseInt(id)),
        with: {
          createdBy: true,
          updatedBy: true,
        },
      })

      if (!point) {
        c.status(404)
        throw new Error(`Point with id ${id} cannot be found`)
      }

      c.status(200)
      return c.json(point)
    } catch (err) {
      console.error(err)
      return c.json({ error: err })
    }
  })
  .get('/:map_id', async (c) => {
    try {
      const { map_id } = c.req.param()

      const map = await db.query.maps.findFirst({
        where: eq(maps.id, Number.parseInt(map_id)),
      })

      if (!map) {
        c.status(404)
        throw new Error(`Map not found with id ${map_id}`)
      }

      const mapPoints = await db.query.points.findMany({
        where: eq(points.mapId, Number.parseInt(map_id)),
        with: {
          createdBy: true,
          updatedBy: true,
        },
      })

      c.status(200)
      c.json({ points: mapPoints })
    } catch (err) {
      console.error(err)
      return c.json({ error: err })
    }
  })
  .post('/', async (c) => {
    try {
      const { mapId, point } = await c.req.json()

      if (!point?.location) {
        c.status(400)
        c.json({ error: 'Point structure invalid' })
      }

      const session = c.get('session').getCache()

      const createdBy = session._id ?? ''
      const updatedBy = session._id ?? ''

      const map = await db.query.maps.findFirst({
        where: eq(maps.id, Number.parseInt(mapId)),
      })

      if (!map) {
        c.status(404)
        throw new Error(`Map with id ${mapId} does not exist`)
      }

      const [_point] = await db
        .insert(points)
        .values({ ...point, mapId, createdBy, updatedBy })
        .returning()

      // missing session ID
      emitMapEvent({ type: 'point-create', sessionID: '', mapId, body: _point })

      c.status(201)
      return c.json(_point)
    } catch (err) {
      console.error(err)
      return c.json({ error: err })
    }
  })
  .put('/:id', async (c) => {
    try {
      const { id } = c.req.param()
      const { point } = await c.req.json()

    const session = c.get('session').getCache()
      point.updatedBy = session._id

      await db
        .update(points)
        .set(point)
        .where(eq(points.id, Number.parseInt(id)))

      const _point = await db.query.points.findFirst({
        where: eq(points.id, Number.parseInt(id)),
        with: {
          createdBy: true,
          updatedBy: true,
        },
      })

      if (!_point) {
        c.status(404)
        throw new Error(`No point found with id : ${id}`)
      }

      const { mapId } = _point

      // Missing sessionID
      emitMapEvent({ type: 'point-update', sessionID: '', mapId, body: _point })

      c.status(201)
      return c.json(_point)
    } catch (err) {
      console.error(err)
      return c.json({ error: err })
    }
  })
  .delete('/:id', async (c) => {
    try {
      const { id } = c.req.param()
      const [point] = await db
        .delete(points)
        .where(eq(points.id, Number.parseInt(id)))
        .returning()

      if (!point) {
        c.status(404)
        throw new Error('No items deleted with id : ${id}')
      }

      const { mapId } = point

      // Missing Session ID
      emitMapEvent({ type: 'point-delete', sessionID: '', mapId, body: { id } })

      c.status(200)
      return c.json({})
    } catch (err) {
      console.error(err)
      return c.json({ error: err })
    }
  })

export { pointProdecures }

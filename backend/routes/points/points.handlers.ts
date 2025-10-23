import { eq } from 'drizzle-orm'
import type { AppRouteHandler } from '@/backend/interfaces/App'
import db from '../../db'
import { maps, points } from '../../db/schema'
import { emitMapEvent } from '../../utils/emitter'
import type { CreatePointRoute, DeletePointByIdRoute, GetPointByIdRoute, GetPointsByMapIdRoute, UpdatePointByIdRoute } from './points.routes'

export const getPointById: AppRouteHandler<GetPointByIdRoute> = async (c) => {
  try {
    const { id } = c.req.valid('param')
    const point = await db.query.points.findFirst({
      where: eq(points.id, id),
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
    return c.json({ error: err })
  }
}

export const getPointsByMapId: AppRouteHandler<GetPointsByMapIdRoute> = async (c) => {
  try {
    const { map_id } = c.req.valid('param')

    const map = await db.query.maps.findFirst({
      where: eq(maps.id, map_id),
    })

    if (!map) {
      c.status(404)
      throw new Error(`Map not found with id ${map_id}`)
    }

    const mapPoints = await db.query.points.findMany({
      where: eq(points.mapId, map_id),
      with: {
        createdBy: true,
        updatedBy: true,
      },
    })

    c.status(200)
    return c.json({ points: mapPoints })
  } catch (err) {
    return c.json({ error: err })
  }
}

export const createPoint: AppRouteHandler<CreatePointRoute> = async (c) => {
  try {
    const point = c.req.valid('json')

    const session = c.get('session').getCache()
    const createdBy = session._id ?? ''
    const updatedBy = session._id ?? ''

    const map = await db.query.maps.findFirst({
      where: eq(maps.id, Number.parseInt(point.mapId)),
    })

    if (!map) {
      c.status(404)
      throw new Error(`Map with id ${point.mapId} does not exist`)
    }

    const [_point] = await db
      .insert(points)
      .values({ ...point, createdBy, updatedBy })
      .returning()

    emitMapEvent({ type: 'point-create', sessionID: session._id ?? '', mapId: point.mapId, body: _point })

    c.status(201)
    return c.json(_point)
  } catch (err) {
    return c.json({ error: err })
  }
}

export const updatePointById: AppRouteHandler<UpdatePointByIdRoute> = async (c) => {
  try {
    const { id } = c.req.valid('param')
    const point = c.req.valid('json')

    const session = c.get('session').getCache()
    point.updatedBy = session._id

    await db
      .update(points)
      .set(point)
      .where(eq(points.id, id))

    const _point = await db.query.points.findFirst({
      where: eq(points.id, id),
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
    emitMapEvent({ type: 'point-update', sessionID: session._id ?? '', mapId, body: _point })

    c.status(201)
    return c.json(_point)
  } catch (err) {
    return c.json({ error: err })
  }
}

export const deletePointById: AppRouteHandler<DeletePointByIdRoute> = async (c) => {
  try {
    const { id } = c.req.valid('param')
    const [point] = await db
      .delete(points)
      .where(eq(points.id, id))
      .returning()

    if (!point) {
      c.status(404)
      throw new Error(`No items deleted with id : ${id}`)
    }

    const { mapId } = point

    // Missing Session ID
    emitMapEvent({ type: 'point-delete', sessionID: '', mapId, body: { id } })

    c.status(200)
    return c.json({})
  } catch (err) {
    return c.json({ error: err })
  }
}

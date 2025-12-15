import { eq } from 'drizzle-orm'
import type { AppRouteHandler } from '@/backend/interfaces/App'
import db from '../../db'
import { maps, points } from '../../db/schema'
import { emitMapEvent } from '../../utils/emitter'
import type { CreatePointRoute, DeletePointByIdRoute, GetPointByIdRoute, GetPointsByMapIdRoute, UpdatePointByIdRoute } from './points.routes'

export const getPointById: AppRouteHandler<GetPointByIdRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const point = await db.query.points.findFirst({
    where: eq(points.id, id),
    with: {
      createdBy: true,
      updatedBy: true,
    },
  })

  if (!point) {
    return c.json({ error: 'Point not found' }, 404)
  }

  return c.json(point, 200)
}

export const getPointsByMapId: AppRouteHandler<GetPointsByMapIdRoute> = async (c) => {
  const { map_id } = c.req.valid('param')

  const map = await db.query.maps.findFirst({
    where: eq(maps.id, map_id),
  })

  if (!map) {
    return c.json({ error: 'Map not found' }, 404)
  }

  const mapPoints = await db.query.points.findMany({
    where: eq(points.mapId, map_id),
    with: {
      createdBy: true,
      updatedBy: true,
    },
  })

  return c.json(mapPoints, 200)
}

export const createPoint: AppRouteHandler<CreatePointRoute> = async (c) => {
  const point = c.req.valid('json')

  const session = c.get('session').getCache()
  const createdById = session._id ?? ''
  const updatedById = session._id ?? ''

  const map = await db.query.maps.findFirst({
    where: eq(maps.id, point.mapId),
  })

  if (!map) {
    return c.json({ error: 'Map not found' }, 404)
  }

  const [_point] = await db
    .insert(points)
    .values({ ...point, createdById, updatedById })
    .returning()

  emitMapEvent({ type: 'point-create', sessionID: session._id ?? '', mapId: point.mapId, body: _point })

  return c.json(_point, 201)
}

export const updatePointById: AppRouteHandler<UpdatePointByIdRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const point = c.req.valid('json')

  const session = c.get('session').getCache()
  point.updatedById = session._id

  await db.update(points).set(point).where(eq(points.id, id))

  const _point = await db.query.points.findFirst({
    where: eq(points.id, id),
    with: {
      createdBy: true,
      updatedBy: true,
    },
  })

  if (!_point) {
    return c.json({ error: 'Point not found'}, 404)
  }

  const { mapId } = _point

  // Missing sessionID
  emitMapEvent({ type: 'point-update', sessionID: session._id ?? '', mapId, body: _point })

  return c.json(_point, 201)
}

export const deletePointById: AppRouteHandler<DeletePointByIdRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const [point] = await db.delete(points).where(eq(points.id, id)).returning()

  if (!point) {
    return c.json({ error: 'Map not found' }, 404)
  }

  const { mapId } = point

  // Missing Session ID
  emitMapEvent({ type: 'point-delete', sessionID: '', mapId, body: { id } })

  c.status(204)
  return c.json({})
}

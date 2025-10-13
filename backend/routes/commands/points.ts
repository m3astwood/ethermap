import type { NextFunction, Request, Response } from 'express'
import { emitMapEvent } from '../utils/emitter'
import db from '../db'
import { eq } from 'drizzle-orm'
import { maps, points } from '../db/schema'

const createPoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mapId, point } = req.body

    if (!point?.location) {
      res.status(400)
      res.json({ error: 'Point structure invalid' })
    }

    const createdBy = req.session.id
    const updatedBy = req.session.id

    const map = await db.query.maps.findFirst({
      where: eq(maps.id, Number.parseInt(mapId)),
    })

    if (!map) {
      res.status(404)
      throw new Error(`Map with id ${mapId} does not exist`)
    }

    const [_point] = await db
      .insert(points)
      .values({ ...point, mapId, createdBy, updatedBy })
      .returning()

    emitMapEvent({ type: 'point-create', sessionID: req.sessionID, mapId, body: _point })

    res.status(201)
    res.json(_point)
  } catch (err) {
    next(err)
  }
}

const updatePoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { point } = req.body

    point.updatedBy = req.session.id

    await db
      .update(points)
      .set(point)
      .where(eq(points.id, Number.parseInt(id)))

    const _point = await db.query.points.findFirst({
      where: eq(points.id, Number.parseInt(id)),
      with: {
        createdBy: true,
        updatedBy: true
      }
    })

    if (!_point) {
      res.status(404)
      throw new Error(`No point found with id : ${id}`)
    }

    const { mapId } = _point

    emitMapEvent({ type: 'point-update', sessionID: req.sessionID, mapId, body: _point })

    res.status(201)
    res.json(_point)
  } catch (err) {
    next(err)
  }
}

const deletePoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const [ point ] = await db.delete(points).where(eq(points.id, Number.parseInt(id))).returning()

    if (!point) {
      res.status(404)
      throw new Error('No items deleted with id : ${id}')
    }

    const { mapId } = point

    emitMapEvent({ type: 'point-delete', sessionID: req.sessionID, mapId, body: { id } })

    res.status(200)
    res.json({})
  } catch (err) {
    next(err)
  }
}

const getPointById = async (req: Request, res: Response, next: NextFunction) => {
}

export { createPoint, updatePoint, deletePoint, getPointById }

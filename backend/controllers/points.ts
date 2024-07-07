import type { NextFunction, Request, Response } from 'express'
import MapModel from '../db/models/map'
import PointModel from '../db/models/point'
import { emitMapEvent } from '../utils/emitter'

const createPoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mapId, point } = req.body

    const created_by = req.session.id
    const updated_by = req.session.id

    const map = await MapModel.query().findById(mapId)

    if (!map) {
      res.status(404)
      throw new Error(`Map with id ${mapId} does not exist`)
    }

    const _point = await map
      .$relatedQuery('map_points')
      .insertGraphAndFetch({ ...point, created_by, updated_by }
        , {
        relate: [ 'created_by_user', 'updated_by_user' ]
      })
      .withGraphFetched({ updated_by_user: true, created_by_user: true })

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

    point.updated_by = req.session.id

    const patched = await PointModel.query().patch(point).findById(id)

    const _point = await PointModel.query()
      .findById(id)
      .withGraphJoined({ updated_by_user: true, created_by_user: true })

    if (!_point) {
      res.status(404)
      throw new Error(`No point found with id : ${id}`)
    }

    const { map_id: mapId } = _point

    emitMapEvent({ type: 'point-update', sessionID: req.sessionID, mapId, body: _point })

    if (patched) {
      res.status(201)
    } else {
      res.status(200)
    }
    res.json(_point)
  } catch (err) {
    next(err)
  }
}

const deletePoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const point = await PointModel.query().select('map_id').findById(id)

    if (!point) {
      res.status(404)
      throw new Error('No items deleted with id : ${id}')
    }

    const { map_id: mapId } = point
    await PointModel.query().deleteById(id)

    emitMapEvent({ type: 'point-delete', sessionID: req.sessionID, mapId, body: { id } })

    res.status(200)
    res.json({})
  } catch (err) {
    next(err)
  }
}

const getPointById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const point = await PointModel.query()
      .findById(id)
      .withGraphJoined({ created_by_user: true, updated_by_user: true })

    if (!point) {
      res.status(404)
      throw new Error(`Point with id ${id} cannot be found`)
    }

    res.status(200)
    res.json(point)
  } catch (err) {
    next(err)
  }
}

export { createPoint, updatePoint, deletePoint, getPointById }

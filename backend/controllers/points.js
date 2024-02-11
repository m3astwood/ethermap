import MapModel from '../db/models/map.js'
import PointModel from '../db/models/point.js'
import { convertMapPoint } from '../utils/toPoint.js'
import { Sockets } from '../sockets.js'

const createPoint = async (req, res, next) => {
  try {
    const { mapId, point } = req.body

    const map = await MapModel.query().findById(mapId)
    const _point = await map.$relatedQuery('map_points').insertAndFetch(point)

    convertMapPoint(_point)

    Sockets[req.sessionID].to(`map-${mapId}`).emit('point-create', _point)

    res.status(201)
    res.json(_point)
  } catch (err) {
    next(err)
  }
}

const updatePoint = async (req, res, next) => {
  try {
    const { id } = req.params
    const { point } = req.body

    const _point = await PointModel.query().patchAndFetchById(id, point)

    if (!_point) {
      res.status(404)
      throw new Error('No point found with id :', id)
    }

    if (process.env.NODE_ENV !== 'test') {
      Sockets[req.sessionID]
        .to(`map-${_point.map_id}`)
        .emit('point-update', _point)
    }

    res.status(201)
    res.json(_point)
  } catch (err) {
    next(err)
  }
}

const deletePoint = async (req, res, next) => {
  try {
    const { id } = req.params
    const point = await PointModel.query()
      .select('map_id')
      .findById(id)

    if (!point) {
      res.status(404)
      throw new Error('No items deleted with id', id)
    }

    const { map_id: mapId } = point
    await PointModel.query().deleteById(id)

    if (process.env.NODE_ENV !== 'test') {
      Sockets[req.sessionID].to(`map-${mapId}`).emit('point-delete', { id })
    }

    res.status(200)
    res.json({})
  } catch (err) {
    next(err)
  }
}

export { createPoint, updatePoint, deletePoint }

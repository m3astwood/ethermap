import MapModel from '../db/models/map.js'
import PointModel from '../db/models/point.js'
import { socket } from '../sockets.js'

const createPoint = async (req, res, next) => {
  try {
    const { mapId, point } = req.body

    point.created_by = req.session.id
    point.updated_by = req.session.id

    const map = await MapModel.query().findById(mapId)

    if (!map) {
      res.status(404)
      throw new Error(`Map with id ${mapId} does not exist`)
    }

    const _point = await map
      .$relatedQuery('map_points')
      .insertGraphAndFetch(point, {
        created_by_user: true,
        updated_by_user: true,
      })

    if (socket.connections.get(req.sessionID)) {
      socket.connections
        .get(req.sessionID)
        .to(`map-${mapId}`)
        .emit('point-create', _point)
    } else if (socket.mapRooms[`map-${mapId}`]) {
      socket.io.to(`map-${mapId}`).emit('point-create', _point)
    }

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

    point.updated_by = req.session.id

    const patched = await PointModel.query()
      .patch(point)
      .findById(id)

    const _point = await PointModel.query()
      .findById(id)
      .withGraphJoined({ updated_by_user: true, created_by_user: true })

    if (!_point) {
      res.status(404)
      throw new Error('No point found with id :', id)
    }

    if (socket.connections.get(req.sessionID)) {
      socket.connections
        .get(req.sessionID)
        .to(`map-${_point.map_id}`)
        .emit('point-update', _point)
    } else if (socket.mapRooms[`map-${_point.map_id}`]) {
      socket.io.to(`map-${_point.map_id}`).emit('point-update', _point)
    }

    if (patched < 1) {
      res.status(200)
    } else {
      res.status(201)
    }
    res.json(_point)
  } catch (err) {
    next(err)
  }
}

const deletePoint = async (req, res, next) => {
  try {
    const { id } = req.params
    const point = await PointModel.query().select('map_id').findById(id)

    if (!point) {
      res.status(404)
      throw new Error('No items deleted with id', id)
    }

    const { map_id: mapId } = point
    await PointModel.query().deleteById(id)

    if (socket.connections.get(req.sessionID)) {
      socket.connections
        .get(req.sessionID)
        .to(`map-${mapId}`)
        .emit('point-delete', id)
    } else if (socket.mapRooms[`map-${mapId}`]) {
      socket.io.to(`map-${mapId}`).emit('point-delete', id)
    }

    res.status(200)
    res.json({})
  } catch (err) {
    next(err)
  }
}

const getPointById = async (req, res, next) => {
  try {
    const { id } = req.params
    const point = await PointModel.query()
      .findById(id)
      .withGraphJoined('[ created_by_user, updated_by_user ]')

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

import MapModel from '../db/models/map.js'
import PointModel from '../db/models/point.js'

const createPoint = async (req, res, next) => {
  try {
    const { mapId, point } = req.body

    const map = await MapModel.query().findById(mapId)
    const _point = await map.$relatedQuery('map_points').insertAndFetch(point)

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

    if (!_point) throw new Error('No point found with id :', id)

    res.status(201)
    res.json(_point)
  } catch (err) {
    res.status(404)
    next(err)
  }
}

const deletePoint = async (req, res, next) => {
  try {
    const { id } = req.params
    const num = await PointModel.query().deleteById(id)

    if (!num) throw new Error('No items deleted with id', id)

    res.status(200)
    res.json({})
  } catch (err) {
    res.status(404)
    next(err)
  }

}


export { createPoint, updatePoint, deletePoint }

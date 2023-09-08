import MapModel from '../db/models/map.js'

const setPoint = async (req, res, next) => {
  try {
    const { mapId, point } = req.body

    const map = await MapModel.query().findById(mapId)
    const p = await map.$relatedQuery('map_points').insert(point)

    res.json(p)
  } catch (err) {
    next(err)
  }
}

export { setPoint }

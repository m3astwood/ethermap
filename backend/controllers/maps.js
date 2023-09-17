import MapModel from '../db/models/map.js'
import { convertMapPoint } from '../utils/toPoint.js'

const getAllMaps = async (_, res) => {
  const maps = await MapModel.query()

  res.json({ maps })
}

const getMapByName = async (req, res, next) => {
  const { name } = req.params
  try {
    let points, map = await MapModel.query().where({ name }).first()

    if (map) {
      points = await map.$relatedQuery('map_points')
      res.status(200)
    } else {
      map = await MapModel
        .query()
        .insertAndFetch({ name })
      points = []

      res.status(201)
    }

    // convert location from string to point
    if (points.length > 0) {
      points.forEach(convertMapPoint)
    }

    res.json({ map, points })
  } catch (err) {
    next(err)
  }
}

const getMapPoints = async (req, res, next) => {
  try {
    const { id } = await req.params

    let map = await MapModel.query().findById(id)

    if (!map) {
      res.status(404)
      throw new Error('No map with id', id)
    }

    let points = await map
      .$relatedQuery('map_points')

    points.forEach(convertMapPoint)

    res.status(200)
    res.json({ points })
  } catch (err) {
    next(err)
  }
}

export { getMapByName, getAllMaps, getMapPoints }

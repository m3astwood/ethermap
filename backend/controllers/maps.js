import MapModel from '../db/models/map.js'
import PointModel from '../db/models/point.js'

const getAllMaps = async (_, res) => {
  const maps = await MapModel.query()

  res.json({ maps })
}

const getMapByName = async (req, res, next) => {
  const { name } = req.params
  try {
    let map = await MapModel.query().where({ name }).withGraphFetched('map_points').first()
    res.status(200)

    if (!map) {
      map = await MapModel
        .query()
        .insertAndFetch({ name })
        .withGraphFetched('map_points')

      res.status(201)
    }

    // convert location from string to point
    if (map?.map_points.length > 0) {
      map.map_points.forEach(p => {
        if (
          typeof p.location === 'string' ||
          p.location instanceof String
        ) {
          const locString = p.location.replace(/[()\s]/g, '')
          const [ x, y ] = locString.split(',')
          p.location = { x, y }
        }
      })
    }

    const { user } = req.session

    res.json({ user, map })
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

    res.status(200)
    res.json({ points })
  } catch (err) {
    next(err)
  }
}

export { getMapByName, getAllMaps, getMapPoints }

import MapModel from '../db/models/map.js'

const getAllMaps = async (_, res) => {
  const maps = await MapModel.query()

  res.json({ maps })
}

const getMapByName = async (req, res) => {
  const name = req.params.mapName
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

    res.json(map)
  } catch (error) {
    console.error(error)
  }
}

export { getMapByName, getAllMaps }

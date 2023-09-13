import MapModel from '../db/models/map.js'

const getAllMaps = async (req, res) => {
  const maps = await MapModel.query()

  res.json({ maps })
}

const getMapByName = async (req, res) => {
  const name = req.params.mapName
  try {
    let map = await MapModel.query().where({ name }).withGraphFetched('map_points').first()

    if (!map) {
      const created = await MapModel.query().insert({ name })
      map = await MapModel.query().findById(created.id).withGraphFetched('map_points')
    }

    res.json(map)
  } catch (error) {
    console.error(error)
  }
}

export { getMapByName, getAllMaps }

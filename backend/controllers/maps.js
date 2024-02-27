import MapModel from '../db/models/map.js'

const getAllMaps = async (_, res) => {
  const maps = await MapModel.query()

  res.json({ maps })
}

// FIX@mx is returning the session of other user's per point an issue??
const getMapByName = async (req, res, next) => {
  const { name } = req.params
  try {
    let points
    let map = await MapModel.query().where({ name }).first()

    if (map) {
      points = await map.$relatedQuery('map_points')
        .withGraphJoined('[created_by_user, updated_by_user]')
      res.status(200)
    } else {
      map = await MapModel.query().insertAndFetch({ name })
      points = []

      res.status(201)
    }

    res.json({ map, points })
  } catch (err) {
    next(err)
  }
}

const getMapPoints = async (req, res, next) => {
  try {
    const { id } = await req.params

    const points = await MapModel.relatedQuery('map_points')
      .withGraphJoined('[created_by_user, updated_by_user]')
      .for(id)

    res.status(200)
    res.json({ points })
  } catch (err) {
    next(err)
  }
}

export { getMapByName, getAllMaps, getMapPoints }

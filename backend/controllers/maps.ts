import type { NextFunction, Request, Response } from 'express'
import MapModel from '../db/models/map'
import type PointModel from '../db/models/point'
import { MapEvent$ } from '../utils/emitter'
import { filter } from 'rxjs'
import type { MapEvent } from '../interfaces/MapEvent'

const getAllMaps = async (_: Request, res: Response) => {
  const maps = await MapModel.query()

  res.json({ maps })
}

// FIX@mx is returning the session of other user's per point an issue??
const getMapByName = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  try {
    let points: PointModel[]
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

const getMapPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const map = await MapModel.query().findById(id)

    if (!map) {
      res.status(404)
      throw new Error(`Map not found with id ${id}`)
    }

    const points = await MapModel
      .relatedQuery('map_points')
      .withGraphJoined({ created_by_user: true, updated_by_user: true })
      .for(id)

    res.status(200)
    res.json({ points })
  } catch (err) {
    next(err)
  }
}

export const mapEvents = (req: Request, res: Response) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  })
  res.flushHeaders();

  MapEvent$.pipe(
    filter((event: MapEvent) => event.mapId === Number.parseInt(req.params.id)),
    filter((event: MapEvent) => event.sessionID !== req.sessionID)
  ).subscribe({
    next: (event) => res.write(`event:${event.type}\ndata: ${JSON.stringify(event.body)}\n\n`)
  })
}

export { getMapByName, getAllMaps, getMapPoints }

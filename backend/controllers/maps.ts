import type { NextFunction, Request, Response } from 'express'
import db from '../db'
import { MapEvent$ } from '../utils/emitter'
import { filter } from 'rxjs'
import type { MapEvent } from '../interfaces/MapEvent'
import { eq } from 'drizzle-orm'

import { type SelectMapSchema, maps } from '../db/schema/map.schema'
import { points, type SelectPointSchema } from '../db/schema/point.schema'

const getAllMaps = async (_: Request, res: Response) => {
  const maps = await db.query.maps.findMany()

  res.json({ maps })
}

const getMapByName = async (req: Request, res: Response, next: NextFunction) => {
  let returnMap: SelectMapSchema
  const { name } = req.params
  try {
    let points: SelectPointSchema[]
    const existingMap = await db.query.maps.findFirst({
      where: eq(maps.name, name),
    })

    if (existingMap) {
      returnMap = existingMap
      points = await db.query.points.findMany({
        with: {
          createdBy: true,
          updatedBy: true,
        }
      })
      res.status(200)
    } else {
      const [ newMap ] = await db.insert(maps).values({ name }).returning()
      points = []

      returnMap = newMap

      res.status(201)
    }

    res.json({ map: returnMap, points })
  } catch (err) {
    next(err)
  }
}

const getMapPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const mapPoints = await db.query.points.findMany({
      where: eq(points.mapId, Number.parseInt(id)),
      with: {
        createdBy: true,
        updatedBy: true
      }
    })

    if (!mapPoints) {
      res.status(404)
      throw new Error(`Map not found with id ${id}`)
    }

    res.status(200)
    res.json({ points: mapPoints })
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

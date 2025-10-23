import { eq } from 'drizzle-orm'
import { streamSSE } from 'hono/streaming'
import { filter } from 'rxjs'
import type { AppRouteHandler } from '@/backend/interfaces/App'
import db from '../../db'
import { maps, type SelectMapWithPointsSchema } from '../../db/schema/map.schema'
import type { MapEvent } from '../../interfaces/MapEvent'
import { MapEvent$ } from '../../utils/emitter'
import type { GetMapByNameRoute, GetMapEventsRoute, GetMapsRoute } from './maps.routes'

export const getMaps: AppRouteHandler<GetMapsRoute> = async (c) => {
  const maps = await db.query.maps.findMany()
  return c.json({ maps })
}

export const getMapByName: AppRouteHandler<GetMapByNameRoute> = async (c) => {
  let returnMap: SelectMapWithPointsSchema
  const { name } = c.req.valid('param')
  try {
    const existingMap = await db.query.maps.findFirst({
      where: eq(maps.name, name),
      with: {
        mapPoints: {
          with: {
            createdBy: true,
            updatedBy: true,
          },
        },
      },
    })
    if (existingMap) {
      returnMap = existingMap
      c.status(200)
    } else {
      const [newMap] = await db.insert(maps).values({ name }).returning()
      returnMap = { ...newMap, mapPoints: [] }
      c.status(201)
    }

    return c.json(returnMap)
  } catch (err) {
    return c.json({ error: err })
  }
}

export const getMapEvents: AppRouteHandler<GetMapEventsRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const session = c.get('session').getCache()
  return streamSSE(c, async (stream) => {
    c.var.logger.info(`Client ${session._id} connected to map ${id} events.`)

    const subscription = MapEvent$.pipe(
      filter((event: MapEvent) => event.mapId === id),
      filter((event: MapEvent) => event.sessionID !== session._id),
    ).subscribe({
      next: async (event) => {
        await stream.writeSSE({ data: JSON.stringify(event.body), event: event.type })
      },
    })

    stream.onAbort(() => {
      c.var.logger.info(`Client ${session._id} disconnected from map ${id} events. Unsubscribing.`)
      subscription.unsubscribe()
    })

    while (!stream.aborted) {
      await stream.write(':\n')
      await stream.sleep(15000)
    }

    c.var.logger.info(`SSE stream terminated for ${session._id} on map ${id}.`)
  })
}

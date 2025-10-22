import type UserSession from '../interfaces/UserSession'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import type { Session } from 'hono-sessions'
import { filter } from 'rxjs'
import db from '../db'
import { maps, type SelectMapSchema } from '../db/schema/map.schema'
import type { MapEvent } from '../interfaces/MapEvent'
import { MapEvent$ } from '../utils/emitter'

const mapProcedures = new Hono<{
  Variables: {
    session: Session<{ user: UserSession }>
    session_key_rotation: boolean
  }
}>()
  .get('/', async (c) => {
    const maps = await db.query.maps.findMany()
    return c.json({ maps })
  })
  .get('/:name', async (c) => {
    let returnMap: SelectMapSchema
    const { name } = c.req.param()
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
        returnMap = newMap
        c.status(201)
      }

      return c.json(returnMap)
    } catch (err) {
      console.error(err)
      return c.json({ error: err })
    }
  })
  .get('/:id/events', async (c) => {
    const { id } = c.req.param()
    const session = c.get('session').getCache()
    return streamSSE(c, async (stream) => {
      console.log(`Client ${session._id} connected to map ${id} events.`)

      const subscription = MapEvent$.pipe(
        filter((event: MapEvent) => event.mapId === Number.parseInt(id)),
        filter((event: MapEvent) => event.sessionID !== session._id),
      ).subscribe({
        next: async (event) => {
          await stream.writeSSE({ data: JSON.stringify(event.body), event: event.type })
        },
      })

      stream.onAbort(() => {
        console.log(`Client ${session._id} disconnected from map ${id} events. Unsubscribing.`)
        subscription.unsubscribe()
      })

      while (!stream.aborted) {
        await stream.write(':\n')
        await stream.sleep(15000)
      }

      console.log(`SSE stream terminated for ${session._id} on map ${id}.`)
    })
  })

export { mapProcedures }

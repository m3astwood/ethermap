import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { filter } from 'rxjs'
import db from '../db'
import { maps, type SelectMapSchema } from '../db/schema/map.schema'
import type { MapEvent } from '../interfaces/MapEvent'
import { MapEvent$ } from '../utils/emitter'
import { Session } from 'hono-sessions'
import UserSession from 'backend/interfaces/UserSession'

const mapProcedures = new Hono<{
  Variables: {
    session: Session<{ user: UserSession }>
    session_key_rotation: boolean
  }
}>()
  .get('/', async (c) => {
    const maps = await db.query.maps.findMany()
    c.json({ maps })
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
    return streamSSE(c, async (stream) => {
      MapEvent$.pipe(
        filter((event: MapEvent) => event.mapId === Number.parseInt(id)),
        // filter((event: MapEvent) => event.sessionID !== req.sessionID)
      ).subscribe({
        next: (event) => stream.writeSSE({ data: event.body, event: event.type }),
      })
    })
  })

export { mapProcedures }

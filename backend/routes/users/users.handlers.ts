import { eq } from 'drizzle-orm'
import db from '@/backend/db'
import { sessions } from '@/backend/db/schema'
import { mapSessions } from '@/backend/db/schema/mapSession.schema'
import type { AppRouteHandler } from '@/backend/interfaces/App'
import type { GetUserRoute, SetMapSessionRoute, SetUserRoute } from './users.routes'
import * as HttpStatusCodes from 'stoker/http-status-codes'

export const getUser: AppRouteHandler<GetUserRoute> = async (c) => {
  const session = c.get('session').getCache()

  if (session._id) {
    const user = await db.query.sessions.findFirst({
      where: eq(sessions.sid, session._id),
      with: {
        mapSessions: true
      }
    })

    return c.json(user)
  } else {
    throw new Error('No session ID found')
  }
}

export const setUser: AppRouteHandler<SetUserRoute> = async (c) => {
  const userData = c.req.valid('json')
  const session = c.get('session').getCache()

  if (!session._id) {
    throw new Error('No session id found or no session matching')
  }

  const [user] = await db.update(sessions).set(userData).where(eq(sessions.sid, session._id)).returning({
    name: sessions.name,
    colour: sessions.colour,
  })

  if (!user.name || !user.colour) {
    throw new Error('Failed to update user - missing name or colour')
  }

  return c.json({ name: user.name, colour: user.colour }, HttpStatusCodes.CREATED)
}

export const setMapSession: AppRouteHandler<SetMapSessionRoute> = async (c) => {
  const mapSessionData = c.req.valid('json')
  const session = c.get('session').getCache()

  if (!session._id) {
    throw new Error('No session id found or no session matching')
  }

  const [mapSession] = await db
    .insert(mapSessions)
    .values({ sid: session._id, ...mapSessionData })
    .onConflictDoUpdate({ target: [mapSessions.sid, mapSessions.mapId], set: mapSessionData })
    .returning()

  // selectMapSessionSchema expects both lastLocation and location fields
  return c.json({ ...mapSession, location: mapSession.lastLocation }, HttpStatusCodes.CREATED)
}

import { eq } from 'drizzle-orm'
import db from '@/backend/db'
import { sessions } from '@/backend/db/schema'
import type { SessionsSchema } from '@/backend/db/schema/session.schema'
import type { AppRouteHandler } from '@/backend/interfaces/App'
import type { GetUserRoute, SetUserRoute } from './users.routes'

export const getUser: AppRouteHandler<GetUserRoute> = async (c) => {
  const session = c.get('session').getCache()
  let user: SessionsSchema | null = null

  if (session._id) {
    user = await db.query.sessions.findFirst({
      where: eq(sessions.sid, session._id),
    })
  }

  console.log(user)

  return c.json({ user: user || {} })
}

export const setUser: AppRouteHandler<SetUserRoute> = async (c) => {
  try {
    const userData = c.req.valid('json')
    const session = c.get('session').getCache()

    if (!session._id) {
      throw new Error('No session id found or no session matching')
    }

    const [user] = await db.update(sessions).set(userData).where(eq(sessions.sid, session._id)).returning()

    return c.json({ user })
  } catch (err) {
    return c.json({ error: err })
  }
}

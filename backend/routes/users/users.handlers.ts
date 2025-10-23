import type { AppRouteHandler } from '@/backend/interfaces/App'
import type { GetUserRoute, SetUserRoute } from './users.routes'

export const getUser: AppRouteHandler<GetUserRoute> = async (c) => {
  const session = c.get('session')
  const user = session.get('user')
  return c.json({ user })
}

export const setUser: AppRouteHandler<SetUserRoute> = async (c) => {
  const userData = await c.req.json()
  const session = c.get('session')
  session.set('user', userData)
  const user = session.get('user')
  return c.json({ user })
}

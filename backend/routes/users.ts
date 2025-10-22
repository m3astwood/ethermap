import { Hono } from 'hono'
import type { Session } from 'hono-sessions'
import type UserSession from '../interfaces/UserSession'

const userProcedures = new Hono<{
  Variables: {
    session: Session<{ user: UserSession }>
    session_key_rotation: boolean
  }
}>()
  // Need to include session ID
  .get('/', async (c) => {
    const session = c.get('session')
    const user = session.get('user')
    return c.json({ user })
  })
  .post('/', async (c) => {
    const userData = await c.req.json()
    const session = c.get('session')
    session.set('user', userData)
    const user = session.get('user')
    return c.json({ user })
  })

export { userProcedures }

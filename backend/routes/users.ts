import { Hono } from "hono";
import { Session } from "hono-sessions";
import UserSession from "../interfaces/UserSession";

const userProcedures = new Hono<{
  Variables: {
    session: Session<UserSession>,
    session_key_rotation: boolean
  }
}>()
  // Need to include session ID
  .get('/', async (c) => {
    const session = c.get('session')
    return c.json({ user: session })
  })
  .post('/', async (c) => {
    // c.req.session.user = { ...c.req.session.user, ...c.req.json() }
    const userData = c.req.json()
    const session = c.get('session')

    return c.json({ user: session })
  })

export { userProcedures }

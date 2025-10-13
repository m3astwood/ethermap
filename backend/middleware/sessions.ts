// express ssession

import type { NextFunction, Request, Response } from 'express'
import { CookieStore, Session, sessionMiddleware } from 'hono-sessions'
// database
import db from '../db'
import { sessions } from '../db/schema'
// session store
import { DrizzlePostgresSessionStore } from '../lib/sessionStore'

// const store = new DrizzlePostgresSessionStore({ db, table: sessions })

const store = new CookieStore()

export default sessionMiddleware({
  store,
  encryptionKey: 'password_at_least_32_characters_long',
  expireAfterSeconds: 900,
  autoExtendExpiration: true,
  cookieOptions: {
    sameSite: 'Lax',
    path: '/',
    httpOnly: true,
  },
})

export const setSessionData = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.user) {
    req.session.user = {
      id: '',
      name: '',
      colour: '',
    }
  }
  next()
}

// express ssession
import session from 'express-session'

// database
import db from '../db'
import { sessions } from '../db/schema'

// knex connections
import { DrizzlePostgresSessionStore } from '../lib/sessionStore'
import type { NextFunction, Request, Response } from 'express'

// set session store
const store = new DrizzlePostgresSessionStore({ db, table: sessions })

export default session({
  secret: 'supersessionstoresecretsauce',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000,
  },
  store,
  rolling: true,
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

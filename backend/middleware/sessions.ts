// express ssession
import session from 'express-session'

// database
import DB from '../db/DB'

// knex connections
import KnexSessionStore from 'connect-session-knex'
import type { NextFunction, Request, Response } from 'express'
const KSS = KnexSessionStore(session)

// set session store
const store = new KSS({ knex: DB, createtable: false })

export default session({
  secret: 'supersessionstoresecretsauce',
  resave: false,
  saveUninitialized: true,
  // httpOnly: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  store,
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

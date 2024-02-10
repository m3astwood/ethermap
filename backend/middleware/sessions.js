// express ssession
import session from 'express-session'

// database
import DB from '../db/DB.js'

// knex connections
import KnexSessionStore from 'connect-session-knex'
const KSS = KnexSessionStore(session)

// set session store
const store = new KSS({ knex: DB })

export default session({
  secret: 'supersessionstoresecretsauce',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  store,
})

export const setSessionData = (req, _, next) => {
  if (!req.session.user) {
    req.session.user = {
      name: '',
      colour: '',
    }
  }
  next()
}

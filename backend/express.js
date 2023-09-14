// web server
import express from 'express'
import session from 'express-session'
import cors from 'cors'

import KnexSessionStore from 'connect-session-knex'
const KSS = KnexSessionStore(session)

// database
import DB from './db/DB.js'

// session store
const store = new KSS({ knex: DB })

// webserver setup
const app = express()
app.use(express.json())
app.use(cors())

app.use(session({
  secret: 'supersessionstoresecretsauce',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  store
}))

// routes
import apiRouter from './routes/api.js'
app.use('/api', apiRouter)

export default app

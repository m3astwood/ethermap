// web server
import express from 'express'
import cors from 'cors'
import pino from 'pino-http'

import type UserSession from './interfaces/UserSession'

// Augment express-session with a custom SessionData object
declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}

// webserver setup
const app = express()
app.use(express.json())
app.use(cors())

// logger
app.use(pino({
  level: 'error',
  transport: {
    target: 'pino-pretty'
  }
}))

//middleware
import session, { setSessionData } from './middleware/sessions'

app.use(session)
app.use(setSessionData)

// routes
import apiRouter from './routes/api'
app.use('/api', apiRouter)

export { app }

// web server
import express from 'express'
import cors from 'cors'

import path from 'node:path'
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

//middleware
import Session, { setSessionData } from './middleware/sessions'

app.use(Session)
app.use(setSessionData)

// routes
import apiRouter from './routes/api'
app.use('/api', apiRouter)

export { app }

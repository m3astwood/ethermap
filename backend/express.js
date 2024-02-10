// web server
import express from 'express'
import cors from 'cors'

// webserver setup
const app = express()
app.use(express.json())
app.use(cors())

//middleware
import Session, { setSessionData } from './middleware/sessions.js'

app.use(Session)
app.use(setSessionData)

// routes
import apiRouter from './routes/api.js'
app.use('/api', apiRouter)

export { app }

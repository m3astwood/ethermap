 // web server
import express from 'express'
import cors from 'cors'

// database
import DB from './db/DB.js'
import { Model } from 'objection'

// database setup
Model.knex(DB)

// webserver setup
const app = express()
app.use(express.json())
app.use(cors())

// routes
import apiRouter from './routes/api.js'
app.use('/api', apiRouter)

export default app

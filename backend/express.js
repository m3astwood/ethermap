 // web server
import express from 'express'
import cors from 'cors'

// database
import DB from './db/DB.js'
import { Model } from 'objection'

// middleware
import ErrorMiddleware from './middleware/errors.js'

// database setup
Model.knex(DB)

// webserver setup
const app = express()
app.use(express.json())
app.use(cors())

// home route
 app.get('/', (_, res) => res.send('ethermap'))

// routes
import apiRouter from './routes/api.js'
app.use('/api', apiRouter)

// error middleware
app.use(ErrorMiddleware)

export default app

// web server
import express from 'express'

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

// routes
import rootRouter from './routes/root.js'
import mapsRouter from './routes/maps.js'
import pointsRouter from './routes/points.js'

app.use(rootRouter)
app.use('/m', mapsRouter)
app.use('/p', pointsRouter)

// error middleware
app.use(ErrorMiddleware)

export default app

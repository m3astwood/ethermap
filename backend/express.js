// web server
import express from 'express'
import cors from 'cors'

// sockets
import { Server } from 'socket.io'
import { Socket } from './sockets.js'

// webserver setup
const app = express()
app.use(express.json())
app.use(cors())

//middleware
import Session, { setSessionData } from './middleware/sessions.js'

app.use(Session)
app.use(setSessionData)

const server = app.listen(process.env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${process.env.PORT}`)
})

const io = new Server(server)
Socket(io, Session)

// routes
import apiRouter from './routes/api.js'
app.use('/api', apiRouter)

export { app, server }

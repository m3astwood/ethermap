import { app } from './backend/express.js'
import ViteExpress from 'vite-express'
import 'dotenv/config'

import Session from './backend/middleware/sessions.js'
import { Socket } from './backend/sockets.js'
import { Server } from 'socket.io'

const server = app.listen(process.env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${process.env.PORT}`)
})

const io = new Server(server)
Socket(io, Session)

ViteExpress.bind(app, server)

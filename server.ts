import { app } from './backend/httpServer'
import ViteExpress from 'vite-express'
import 'dotenv/config'

import Session from './backend/middleware/sessions'
import { socket } from './backend/sockets'

const server = app.listen(process.env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${process.env.PORT}`)
})

// sockets
socket.upgrade(server, Session)

// vite setup
ViteExpress.bind(app, server)

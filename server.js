import { app, server } from './backend/express.js'
import ViteExpress from 'vite-express'
import 'dotenv/config'

// import Session from './backend/middleware/sessions.js'
// import { Socket } from './backend/sockets.js'
// import { Server } from 'socket.io'


ViteExpress.bind(app, server)

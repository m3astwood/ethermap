import App from './backend/express.js'
import ViteExpress from 'vite-express'
import 'dotenv/config'

import { Socket } from './backend/sockets.js'
import { Server } from 'socket.io'


const server = App.listen(process.env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${process.env.PORT}`)
})

const io = new Server(server)

ViteExpress.bind(App, server)

Socket(io)

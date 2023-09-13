import App from './express.js'
import 'dotenv/config'

import { Socket } from './sockets.js'
import { Server } from 'socket.io'

const server = App.listen(process.env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${process.env.PORT}`)
})

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

Socket(io)

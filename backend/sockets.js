import { Server } from "socket.io"
import PointModel from "./db/models/point.js"

export default class SocketConnection {
  constructor() {
    this.io = new Server()

    // state
    this.connections = new Map()

    this.io.on('connection', (socket) => {
      console.log('socket connection', socket.request.sessionID)

      let roomId = null
      const session = socket.request.session
      session.user.id = socket.request.sessionID

      this.connections.set(socket.request.sessionID, socket)

      socket.on('connect-map', (mapId) => {
        console.log('connect to map room', mapId)

        roomId = `map-${mapId}`

        // add socket to map room
        socket.join(roomId)
      })

      // update point data
      socket.on('client-point-update', async (point) => {
        point.updated_by = socket.request.sessionID
        const _point = await PointModel.query()
          .patchAndFetchById(point.id, point)

        socket.to(roomId).emit('point-update', _point)
      })

      // mouse movement
      socket.on('mousemove', (pos) => {
        socket.to(roomId).emit('mousemove', { user: { ...session.user }, pos })
      })

      // user settings update
      socket.on('user-updated', (settings) => {
        socket.to(roomId).emit('user-updated', { id: session.user.id, ...settings })
      })

      socket.on('disconnect', () => {
        console.log('session', session.user.id, 'disconnected')

        this.connections.delete('session.user.id')
        socket.to(roomId).emit('user-disconnected', session.user.id)
      })
    })
  }

  get mapRooms() {
    return this.io.sockets.adapter.rooms || []
  }

  upgrade(server, session) {
    this.io.attach(server)
    if (session) {
      this.io.engine.use(session)
    }
  }
}

export const socket = new SocketConnection()

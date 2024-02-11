export const Sockets = {}

export const Socket = (io, session) => {
  io.engine.use(session)

  io.on('connection', (socket) => {
    console.log('socket connection', socket.request.sessionID)

    let roomId = null
    const session = socket.request.session
    session.user.id = socket.request.sessionID

    Sockets[socket.request.sessionID] = socket

    socket.on('connect-map', (mapId) => {
      console.log('connect to map room', mapId)

      roomId = `map-${mapId}`

      // add socket to map room
      socket.join(roomId)
    })

    socket.on('mousemove', (pos) => {
      socket.to(roomId).emit('mousemove', { user: { ...session.user }, pos })
    })

    socket.on('disconnect', () => {
      console.log('session', session.user.id, 'disconnected')

      delete Sockets[session.user.id]
      socket.to(roomId).emit('user-disconnected', session.user.id)
    })
  })
}

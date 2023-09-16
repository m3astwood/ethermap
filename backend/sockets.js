export const Socket = (io, session) => {
  io.engine.use(session)

  io.on('connection', (socket) => {
    let roomId = null
    const session = socket.request.session
    session.user.id = socket.request.sessionID
    console.log('client connected with id', session.user.id)

    socket.on('connect-map', (mapId) => {
      console.log('connect to map room', mapId)

      roomId = `map-${mapId}`

      socket.join(roomId)
    })

   socket.on('mousemove', (pos) => {
      socket.to(roomId).emit('mousemove', { user: { ...session.user }, pos })
    })

    socket.on('new-point', (point) => {
      console.log(point)
      socket.to(roomId).emit('new-point', point)
    })

    socket.on('disconnect', () => {
      console.log('session', session.user.id, 'disconnected')
      socket.to(roomId).emit('user-disconnected', session.user.id)
    })
  })

}

export const Socket = (io, session) => {
  io.engine.use(session)

  io.on('connection', (socket) => {
    console.log('client connected with id', socket.id)
    let roomId = null
    const session = socket.request.session
    session.user.id = socket.id

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

  })
}

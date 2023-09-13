export const Socket = (io) => {
  io.on('connection', (socket) => {
    console.log('client connected with id', socket.id)
    let roomId = null

    socket.on('connect-map', (mapId) => {
      console.log('connect to map room', mapId)

      roomId = `map-${mapId}`

      socket.join(roomId)
    })

   socket.on('mousemove', (latlng) => {
      socket.to(roomId).emit('mousemove', { id: socket.id, pos: latlng })
    })

  })
}

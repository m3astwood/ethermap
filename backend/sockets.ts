// import { eq } from 'drizzle-orm'
// import type { Request } from 'express'
// import { Server, type Socket } from 'socket.io'
// import db from './db'
// import { points } from './db/schema/point.schema'
//
// export default class SocketConnection {
//   io: Server
//   connections: Map<string, Socket> = new Map()
//
//   constructor() {
//     this.io = new Server()
//
//     this.io.on('connection', (socket: Socket) => {
//       const req = socket.request as Request
//       console.log('socket connection', req.session.id)
//
//       let roomId: string
//       this.connections.set(req.session.id, socket)
//
//       socket.on('connect-map', (mapId: number) => {
//         console.log('connect to map room', mapId)
//
//         roomId = `map-${mapId}`
//
//         // add socket to map room
//         socket.join(roomId)
//       })
//
//       // update point data
//       socket.on('client-point-update', async (point) => {
//         point.updated_by = req.session.id
//         const patched = await db.update(points).set(point).where(eq(points.id, point.id)).returning()
//
//         if (patched.length > 0) {
//           const _point = await db.query.points.findFirst({
//             where: eq(points.id, point.id),
//             with: {
//               updatedBy: true,
//               createdBy: true,
//             },
//           })
//
//           socket.to(roomId).emit('point-update', _point)
//         }
//       })
//
//       // mouse movement
//       socket.on('mousemove', (pos) => {
//         socket.to(roomId).emit('mousemove', { user: { ...req.session.user }, pos })
//       })
//
//       // user settings update
//       socket.on('user-updated', (settings) => {
//         socket.to(roomId).emit('user-updated', { id: req.session.user?.id, ...settings })
//       })
//
//       socket.on('disconnect', () => {
//         console.log('session', req.session.user?.id, 'disconnected')
//
//         if (req.session.user?.id) {
//           this.connections.delete(req.session.user.id)
//           socket.to(roomId).emit('user-disconnected', req.session.user?.id)
//         }
//       })
//     })
//   }
//
//   get mapRooms() {
//     return this.io.sockets.adapter.rooms || []
//   }
//
//   upgrade(server, session) {
//     this.io.attach(server)
//     if (session) {
//       this.io.engine.use(session)
//     }
//   }
// }
//
// export const socket = new SocketConnection()

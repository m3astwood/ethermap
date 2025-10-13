import { io, type Socket } from 'socket.io-client'

const ioClient: Socket = io()

export default ioClient

import { app } from './backend/httpServer'
import ViteExpress from 'vite-express'
import 'dotenv/config'

import path from 'node:path'
import Session from './backend/middleware/sessions'
import { socket } from './backend/sockets'
import express, { type Request, type Response } from 'express'

const server = app.listen(process.env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${process.env.PORT}`)
})

// sockets
socket.upgrade(server, Session)

if (['development', 'test'].includes(process.env.NODE_ENV ?? '')) {
  // vite hosting
  ViteExpress.bind(app, server)
} else {
  // static hosting
  app.use(express.static(path.resolve('./frontend')))
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve('./frontend/index.html'))
  })
}

import { app } from './backend/httpServer'
import ViteExpress from 'vite-express'
import 'dotenv/config'

import path from 'node:path'
import Session from './backend/middleware/sessions'
import { socket } from './backend/sockets'
import express, { type Request, type Response } from 'express'
import env from './backend/lib/env'
import { migrateSchemas } from './backend/db'

const server = app.listen(env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${env.PORT}`)
})

// sockets
socket.upgrade(server, Session)

if (['development', 'test'].includes(process.env.NODE_ENV ?? '')) {
  // vite hosting
  ViteExpress.bind(app, server)
} else {
  // auto migrate
  migrateSchemas()
    .then(() => {
      console.log('Successfully migrated database structure')
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

  // static hosting
  app.use(express.static(path.resolve('./frontend')))
  app.all('/*splat', (_req: Request, res: Response) => {
    res.sendFile(path.resolve('./frontend/index.html'))
  })
}

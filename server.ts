import { app } from './backend/httpServer'
import 'dotenv/config'

import path from 'node:path'
import { migrateSchemas } from './backend/db'
import env from './backend/lib/env'
import Session from './backend/middleware/sessions'
import { socket } from './backend/sockets'

const server = app.listen(env.PORT, () => {
  console.log(`Ethermap listening for connections on port ${env.PORT}`)
})

// sockets
// socket.upgrade(server, Session)

if (['development', 'test'].includes(env.NODE_ENV ?? '')) {
  // vite hosting
  ViteExpress.bind(app, server)
} else {
  // auto migrate
  migrateSchemas()
    .then(() => {
      console.log('Successfully migrated database structure')
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })

  // static hosting
  app.use(express.static(path.resolve('./frontend')))
  app.all('/*splat', (_req: Request, res: Response) => {
    res.sendFile(path.resolve('./frontend/index.html'))
  })
}

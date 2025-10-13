// web server

import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { html } from 'hono/html'
//middleware
import type { Session } from 'hono-sessions'
import pino from 'pino-http'
import type UserSession from './interfaces/UserSession'
import session from './middleware/sessions'
import { mapProcedures } from './routes/maps'
import { pointProdecures } from './routes/points'
import { userProcedures } from './routes/users'

// webserver setup
const app = new Hono<{
  Variables: {
    session: Session<UserSession>
    session_key_rotation: boolean
  }
}>()

app.use('*', session)

// routes
// import apiRouter from './routes/api'
const routes = app.route('/api/maps', mapProcedures).route('/api/points', pointProdecures).route('/api/users', userProcedures)

// Host frontend in dev
app.use('../frontend/public/*', serveStatic({ root: './' }))
app.get('/*', (c) => {
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <base href="/">
        <title>ethermap</title>
        <link href="/styles/main.css" rel="stylesheet">
        <script type="module" src="/src/EthermapApp.ts"></script>
      </head>
      <body>
        <ethermap-app></ethermap-app>
      </body>
    </html>
    `)
})

export { app }
export type AppType = typeof routes

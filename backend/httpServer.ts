// web server
import { Hono } from 'hono'
import { html } from 'hono/html'
import { serveStatic } from '@hono/node-server/serve-static'
import pino from 'pino-http'

import type UserSession from './interfaces/UserSession'
import client from './routes/client'

// Augment express-session with a custom SessionData object

// webserver setup
const app = new Hono()

// logger
// app.use(pino({
//   level: 'error',
//   transport: {
//     target: 'pino-pretty'
//   }
// }))

//middleware
// import session, { setSessionData } from './middleware/sessions'
//
// app.use(session)
// app.use(setSessionData)

// routes
// import apiRouter from './routes/api'
app.use('/api', apiRouter)

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

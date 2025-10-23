// web server
import { serveStatic } from '@hono/node-server/serve-static'
import { html } from 'hono/html'
//middleware
import { createApp } from './lib/createApp'
import configureOpenAPI from './lib/configureOpenApi'
import index from './routes'
import maps from './routes/maps/maps.index'
import points from './routes/points/points.index'
import users from './routes/users/users.index'

// bootstrap App
const app = createApp()

// setup openapi rest interface
configureOpenAPI(app)

// endpoints
const routes = app
  .route('/api', index)
  .route('/api/maps', maps)
  .route('/api/points', points)
  .route('/api/users', users)

// host frontend in dev
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

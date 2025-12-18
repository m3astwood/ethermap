import { serve } from '@hono/node-server'
import { app } from './backend/app'
import env from './backend/lib/env'

console.log(`${env.SITE_NAME} running on port ${env.PORT}.`)
serve(app)


import { OpenAPIHono } from '@hono/zod-openapi'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'
import { defaultHook } from 'stoker/openapi'
import type { AppBindings } from '@/backend/interfaces/App'
import session from '@/backend/middleware/sessions'
import { pinoLogger } from '../middleware/pinoLogger'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}

export function createApp() {
  const app = createRouter()

  app.use(serveEmojiFavicon('🗺️')).use(pinoLogger()).use('*', session)

  app.notFound(notFound)
  app.onError(onError)

  return app
}

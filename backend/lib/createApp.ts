import { OpenAPIHono } from '@hono/zod-openapi'
import session, { setSessionData } from '@/backend/middleware/sessions'
import { AppBindings } from '@/backend/interfaces/App'
import { defaultHook } from 'stoker/openapi'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'
import { pinoLogger } from '../middleware/pinoLogger'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}

export function createApp() {
  const app = createRouter()

  app
    .use(serveEmojiFavicon('🗺️'))
    .use(pinoLogger())
    .use('*', session)
    .use('*', setSessionData)

  app.notFound(notFound)
  app.onError(onError)

  return app
}

import type { AppRouteHandler } from '@/backend/interfaces/App'
import env from '@/backend/lib/env'
import type { GetEnvironmentRoute } from './env.routes'

export const getEnvironment: AppRouteHandler<GetEnvironmentRoute> = async (c) => {
  return c.json({ SENTRY_DSN: env.FRONTEND_SENTRY_DSN })
}

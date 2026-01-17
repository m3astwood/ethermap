import { createRouter } from '@/backend/lib/createApp'
import * as handlers from './env.handlers'
import * as routes from './env.routes'

export default createRouter().openapi(routes.getEnvironment, handlers.getEnvironment)

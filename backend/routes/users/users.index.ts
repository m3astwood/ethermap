import { createRouter } from '@/backend/lib/createApp'
import * as handlers from './users.handlers'
import * as routes from './users.routes'

export default createRouter().openapi(routes.getUser, handlers.getUser).openapi(routes.setUser, handlers.setUser).openapi(routes.setMapSession, handlers.setMapSession)

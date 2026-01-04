import { createRouter } from '@/backend/lib/createApp'
import * as handlers from './maps.handlers'
import * as routes from './maps.routes'

export default createRouter()
  .openapi(routes.getMaps, handlers.getMaps)
  .openapi(routes.getMapByName, handlers.getMapByName)
  .openapi(routes.getMapEvents, handlers.getMapEvents)

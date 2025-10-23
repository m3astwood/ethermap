import { createRouter } from "@/backend/lib/createApp";
import * as routes from './maps.routes'
import * as handlers from './maps.handlers'

export default createRouter()
  .openapi(routes.getMaps, handlers.getMaps)
  .openapi(routes.getMapByName, handlers.getMapByName)
  .openapi(routes.getMapEvents, handlers.getMapEvents)

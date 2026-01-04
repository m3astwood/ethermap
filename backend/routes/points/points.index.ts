import { createRouter } from '@/backend/lib/createApp'
import * as handlers from './points.handlers'
import * as routes from './points.routes'

export default createRouter()
  .openapi(routes.getPointById, handlers.getPointById)
  .openapi(routes.getPointsByMapId, handlers.getPointsByMapId)
  .openapi(routes.createPoint, handlers.createPoint)
  .openapi(routes.updatePointById, handlers.updatePointById)
  .openapi(routes.deletePointById, handlers.deletePointById)

import { createRouter } from "@/backend/lib/createApp";
import * as routes from './users.routes'
import * as handlers from './users.handlers'

export default createRouter()
  .openapi(routes.getUser, handlers.getUser)
  .openapi(routes.setUser, handlers.setUser)


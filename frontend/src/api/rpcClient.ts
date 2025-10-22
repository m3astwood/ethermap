import { hc } from 'hono/client'
import { AppType } from '../../../backend/httpServer'

export const rpcClient = hc<AppType>(location.origin, {
  init: {
    credentials: 'include',
  },
})



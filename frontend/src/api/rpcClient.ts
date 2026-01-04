import { hc } from 'hono/client'
import type { AppType } from '../../../backend/app'

export const rpcClient = hc<AppType>(location.origin, {
  init: {
    credentials: 'include',
  },
})

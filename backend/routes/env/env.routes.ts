import { createRoute } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { FrontEnvSchema } from '@/backend/lib/env'

const tags = ['Environment']

export const getEnvironment = createRoute({
  path: '/',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(FrontEnvSchema, 'Frontend Environment'),
  },
})

export type GetEnvironmentRoute = typeof getEnvironment

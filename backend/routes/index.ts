import { createRouter } from '@/backend/lib/createApp'
import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { version } from '@/package.json' with { type: 'json' }

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(z.object({
        message: z.string().default('Ethermap API'),
        version: z.string()
      }), 'Ethermap API Index'),
    },
  }),
  (c) => {
    return c.json(
      {
        message: 'Ethermap API',
        version
      },
      HttpStatusCodes.OK,
    )
  },
)

export default router

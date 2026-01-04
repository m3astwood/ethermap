import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { createRouter } from '@/backend/lib/createApp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'))
const version = packageJson.version

const router = createRouter().openapi(
  createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.object({
          message: z.string().default('Ethermap API'),
          version: z.string(),
        }),
        'Ethermap API Index',
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: 'Ethermap API',
        version,
      },
      HttpStatusCodes.OK,
    )
  },
)

export default router

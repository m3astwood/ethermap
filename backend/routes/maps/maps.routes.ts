import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas'
import { selectMapSchema } from '@/backend/db/schema'
import { selectMapWithPointsSchema } from '@/backend/db/schema/map.schema'

const tags = ['Maps']

// TODO : move this somewhere more appropriate
const MapEventStreamSchema = z.string().openapi({
  example: 'event: point-update\ndata: {"id": 123, "name": "New Point", "location": {"lat": 40.7, "lng": -74.0}}\n\n',
  description: 'Server-Sent Event data stream, where each "data" field contains a JSON object conforming to selectPointSchema.',
})

export const getMaps = createRoute({
  path: '/',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        maps: z.array(selectMapSchema),
      }),
      'List of maps',
    ),
  },
})

export const getMapByName = createRoute({
  path: '/:name',
  method: 'get',
  request: {
    params: z.object({
      name: z.string().openapi({
        description: 'Name of map',
        example: 'bingo',
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMapWithPointsSchema, 'Get map by name'),
    [HttpStatusCodes.CREATED]: jsonContent(selectMapWithPointsSchema, 'Create map by name'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(z.object({ error: z.string() }), 'Server error'),
  },
})

// TODO : this response validation was AI generated should be investiagted (is working for now...)
export const getMapEvents = createRoute({
  path: '/:id/events',
  method: 'get',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      description: 'A Server-Sent Events (SSE) stream providing real-time point manipulations.',
      content: {
        'text/event-stream': {
          schema: MapEventStreamSchema,
        },
      },
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid id error'),
  },
})

export type GetMapsRoute = typeof getMaps
export type GetMapByNameRoute = typeof getMapByName
export type GetMapEventsRoute = typeof getMapEvents

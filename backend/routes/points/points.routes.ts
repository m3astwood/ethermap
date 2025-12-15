import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas'
import { insertPointSchema, selectPointSchema } from '@/backend/db/schema'
import { patchPointSchema, selectPointSchemaWithUsers } from '@/backend/db/schema/point.schema'

const tags = ['Points']

export const getPointById = createRoute({
  path: '/:id',
  method: 'get',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPointSchemaWithUsers, 'Selected point'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Point not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid id error'),
  },
})

export const getPointsByMapId = createRoute({
  path: '/map/:map_id',
  method: 'get',
  request: {
    params: z.object({
      map_id: z.coerce.number().openapi({
        description: 'ID of map',
        example: 1,
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectPointSchemaWithUsers), 'List of points for map'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Map not found',
    ),
  },
})

export const createPoint = createRoute({
  path: '/',
  method: 'post',
  request: {
    body: jsonContentRequired(insertPointSchema, 'The point to create with associated mapId'),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectPointSchema, 'The point that was created'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Map not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertPointSchema), 'The validation error(s)'),
  },
})

export const updatePointById = createRoute({
  path: '/:id',
  method: 'put',
  request: {
    params: IdParamsSchema,
    body: jsonContent(patchPointSchema, 'The point to update'),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectPointSchemaWithUsers, 'The point that was updated'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Point not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(patchPointSchema), 'The validation error(s)'),
  },
})

export const deletePointById = createRoute({
  path: '/:id',
  method: 'delete',
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Point deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      {
        error: z.string(),
      },
      'Point not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid id error'),
  },
})

export type GetPointByIdRoute = typeof getPointById
export type GetPointsByMapIdRoute = typeof getPointsByMapId
export type CreatePointRoute = typeof createPoint
export type UpdatePointByIdRoute = typeof updatePointById
export type DeletePointByIdRoute = typeof deletePointById

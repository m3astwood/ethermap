import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'
import { insertMapSessionSchema, selectMapSessionSchema } from '@/backend/db/schema/mapSession.schema'
import { sessionSchema, sessionUserSchema } from '@/backend/db/schema/session.schema'

const tags = ['Users']

export const getUser = createRoute({
  path: '/',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(sessionSchema, 'User session'),
  },
})

export const setUser = createRoute({
  path: '/',
  method: 'post',
  request: {
    body: jsonContentRequired(sessionUserSchema, 'User to create/update'),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(sessionUserSchema, 'User session'),
  },
})

export const setMapSession = createRoute({
  path: '/map',
  method: 'post',
  request: {
    body: jsonContentRequired(insertMapSessionSchema, 'Map session to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectMapSessionSchema, 'Map session created'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertMapSessionSchema), 'The validation error(s)'),
  },
})

export type GetUserRoute = typeof getUser
export type SetUserRoute = typeof setUser
export type SetMapSessionRoute = typeof setMapSession

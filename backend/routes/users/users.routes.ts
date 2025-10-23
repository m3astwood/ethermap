import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { sessionUserSchema, sessionSchema } from '@/backend/db/schema/session.schema'

const tags = ['Users']

export const getUser = createRoute({
  path: '/',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(sessionUserSchema, 'User session'),
  },
})

export const setUser = createRoute({
  path: '/',
  method: 'post',
  request: {
    body: jsonContentRequired(sessionUserSchema, 'User to create/update')
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(sessionUserSchema, 'User session'),
  }
})

export type GetUserRoute = typeof getUser
export type SetUserRoute = typeof setUser

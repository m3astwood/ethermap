import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { Schema } from 'hono'
import type { PinoLogger } from 'hono-pino'
import type { Session } from 'hono-sessions'
import type UserSession from './UserSession'

export interface AppBindings {
  Variables: {
    session: Session<{ user: UserSession }>
    session_key_rotation: boolean
    logger: PinoLogger
  }
}

export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>

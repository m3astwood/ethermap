import { drizzle as postgresDrizzle } from 'drizzle-orm/node-postgres'
import { drizzle as pgliteDrizzle } from 'drizzle-orm/pglite'
import env from '../lib/env'
import * as schema from './schema'

let db

if (env.NODE_ENV === 'test') {
  db = pgliteDrizzle({ schema })
} else {
  db = postgresDrizzle(`postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`, { schema })
}
export type Db = typeof db
export default db

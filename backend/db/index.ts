import { drizzle } from 'drizzle-orm/node-postgres'
import env from '../lib/env'
import * as schema from './schema'

const db = drizzle(`postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}`, { schema })
export type Db = typeof db

export default db

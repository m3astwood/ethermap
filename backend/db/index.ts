import { NodePgDatabase, drizzle as postgresDrizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle as pgliteDrizzle } from 'drizzle-orm/pglite'
import env from '../lib/env'
import * as schema from './schema'

let db: NodePgDatabase<typeof schema>

if (env.NODE_ENV === 'test') {
  // @ts-ignore: don't need typing for tests
  db = pgliteDrizzle({ schema })
} else {
  db = postgresDrizzle(`postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`, { schema })
}

export const migrateSchemas = async () => {
  await migrate(db, { migrationsFolder: './backend/db/migrations/'})
}

export type Db = typeof db
export default db

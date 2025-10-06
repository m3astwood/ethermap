import type { Config } from 'drizzle-kit'
import env from './backend/lib/env'

export default {
  dialect: 'postgresql',
  schema: './backend/db/schema',
  out: './backend/db/migrations',
  dbCredentials: {
    url: `postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`
  }
} satisfies Config

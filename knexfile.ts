// Update with your config settings.
import 'dotenv/config'
import type { Knex } from 'knex'
import env from './backend/lib/env'

interface KnexConfig {
  [key: string]: Knex.Config
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config: KnexConfig = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './backend/db/development.db',
    },
    migrations: {
      directory: './backend/db/migrations',
    },
    seeds: {
      directory: './backend/db/seeds',
    },
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: './backend/db/migrations',
    },
    seeds: {
      directory: './backend/db/seeds',
    },
  },

  staging: {
    client: env.DB_PROVIDER,
    connection: {
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASS,
      host: env.DB_HOST,
      port: env.DB_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './backend/db/migrations',
    },
    seeds: {
      directory: './backend/db/seeds',
    },
  },

  production: {
    client: env.DB_PROVIDER,
    connection: {
      filename: env.DB_FILE,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASS,
      host: env.DB_HOST,
      port: env.DB_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './backend/db/migrations',
    },
    seeds: {
      directory: './backend/db/seeds',
    },
  },
}

export default config

// Update with your config settings.
import 'dotenv/config'
import type { Knex } from 'knex'

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
    client: process.env.DB_PROVIDER,
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || ''),
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
    client: process.env.DB_PROVIDER,
    connection: {
      filename: process.env.DB_FILE,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || ''),
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

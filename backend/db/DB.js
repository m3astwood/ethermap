import knexConfig from '../knexfile.js'
import Knex from 'knex'
import { Model } from 'objection'
import { newDb } from 'pg-mem'

const environment = process.env.NODE_ENV || 'development'

// variable for exporting the db
let DB

if (environment == 'test') {
  const mem = newDb()
  DB = mem.adapters.createKnex(0, {
    migrations: {
      directory: './db/migrations'
    },
  })
  Model.knex(DB)
} else {
  DB = Knex(knexConfig[environment])
}

export default DB

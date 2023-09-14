import knexConfig from '../../knexfile.js'
import Knex from 'knex'
import { Model } from 'objection'

const environment = process.env.NODE_ENV || 'development'

// variable for exporting the db
let DB

DB = Knex(knexConfig[environment])
Model.knex(DB)

export default DB

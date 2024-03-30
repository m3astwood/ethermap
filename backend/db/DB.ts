import knexConfig from '../../knexfile'
import Knex from 'knex'
import { Model } from 'objection'

const environment = process.env.NODE_ENV || 'development'

console.log(`connecting to ${environment} db : ${knexConfig[environment].client}`)

// variable for exporting the db
const DB = Knex(knexConfig[environment])
Model.knex(DB)

export default DB

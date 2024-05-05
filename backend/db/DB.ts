import Knex from "knex"
import { Model } from "objection"
import knexConfig from "../../knexfile"

const environment = process.env.NODE_ENV || "development"

// biome-ignore lint/suspicious/noConsoleLog: CLI Feedback
console.log(`connecting to ${environment} db : ${knexConfig[environment].client}`)

// variable for exporting the db
const DB = Knex(knexConfig[environment])
Model.knex(DB)

export { DB }

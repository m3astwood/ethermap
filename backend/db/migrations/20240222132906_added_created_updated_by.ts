import type { Knex } from "knex"

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.table('map_points', (table) => {
    table.string('created_by').references('sid').inTable('sessions')
    table.string('updated_by').references('sid').inTable('sessions')
  })
}

export function down(knex:Knex): Knex.SchemaBuilder {
  return knex.schema.table('map_points', (table) => {
    table.dropColumn('created_by')
    table.dropColumn('updated_by')
  })
}

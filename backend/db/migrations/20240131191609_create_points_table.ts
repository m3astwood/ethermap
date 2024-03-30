import type { Knex } from "knex"

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('map_points', (table) => {
    table.increments().primary()
    table.string('name')
    table.string('notes')
    table.point('location')
    table.timestamps(false, true)
    table.integer('map_id').references('id').inTable('maps').onDelete('CASCADE')
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable('map_points')
}

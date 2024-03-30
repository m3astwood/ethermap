import type { Knex } from "knex"

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('maps', (table) => {
    table.increments().primary()
    table.string('name').notNullable().unique()
    table.timestamps(false, true)
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  if (knex.client.version === 'pg' || knex.client.version === 'pg-mem') {
    return knex.schema.raw('DROP TABLE maps CASCADE')
  }
  return knex.schema.dropTable('maps')
}

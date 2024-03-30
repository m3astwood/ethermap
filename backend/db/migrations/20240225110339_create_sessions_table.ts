import type { Knex } from 'knex'

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('sessions', (table) => {
    table.string('sid').primary()
    table.json('sess')
    table.dateTime('expired')
  })
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable('sessions')
}

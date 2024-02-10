/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('maps', (table) => {
    table.increments().primary()
    table.string('name').notNullable().unique()
    table.timestamps(false, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  if (knex.client.version === 'pg' || knex.client.version === 'pg-mem') {
    return knex.schema.raw('DROP TABLE maps CASCADE')
  } else {
    return knex.schema.dropTable('maps')
  }
}

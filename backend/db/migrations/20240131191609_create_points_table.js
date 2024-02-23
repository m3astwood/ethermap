/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('map_points', (table) => {
    table.increments().primary()
    table.string('name')
    table.string('notes')
    table.point('location')
    table.timestamps(false, true)
    table.integer('map_id').references('id').inTable('maps').onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('map_points')
}

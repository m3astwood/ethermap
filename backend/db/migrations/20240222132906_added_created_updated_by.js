/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.table('map_points', (table) => {
    table.string('created_by').references('sid').inTable('sessions')
    table.string('updated_by').references('sid').inTable('sessions')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.table('map_points', (table) => {
    table.dropColumn('created_by')
    table.dropColumn('updated_by')
  })
}

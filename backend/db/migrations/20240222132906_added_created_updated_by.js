/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.table('map_points', (table) => {
    table.string('created_by')
    table.string('updated_by')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.table('map_points', (table) => {
    table.dropColumn('created_by')
    table.dropColumnn('updated_by')
  })
}

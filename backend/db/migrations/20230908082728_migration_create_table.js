/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => {
  return knex.schema
    .createTable('maps', (table) => {
      table.increments().primary()
      table.string('name').notNullable().unique()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('map_points', (table) => {
      table.increments().primary()
      table.string('name')
      table.string('notes')
      table.point('location')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      table.integer('map_id').references('id').inTable('maps').onDelete('CASCADE')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = (knex) => {
  if (knex.client.version === 'pg' || knex.client.version === 'pg-mem') {
    return knex.schema
      .raw('DROP TABLE maps CASCADE')
      .dropTable('map_points')
  } else {
    return knex.schema
      .dropTable('maps')
      .dropTable('map_points')
  }
}

export { up, down }

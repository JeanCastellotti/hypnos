import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Suites extends BaseSchema {
  protected tableName = 'suites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.float('price').notNullable()
      table.string('booking_url').notNullable()
      table.string('picture_1').notNullable()
      table.string('picture_2').notNullable()
      table
        .integer('establishment_id')
        .references('establishments.id')
        .onDelete('CASCADE')
        .notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

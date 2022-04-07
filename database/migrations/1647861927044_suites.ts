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

      table.integer('establishment_id').references('establishments.id').onDelete('CASCADE')
      table.integer('picture_1').references('suites_pictures.id').onDelete('CASCADE')
      table.integer('picture_2').references('suites_pictures.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

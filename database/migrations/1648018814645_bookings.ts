import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bookings extends BaseSchema {
  protected tableName = 'bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('from', { useTz: true })
      table.timestamp('to', { useTz: true })
      table.integer('suite_id').references('suites.id').notNullable()
      table.integer('user_id').references('users.id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

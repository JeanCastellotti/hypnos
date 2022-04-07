import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Establishments extends BaseSchema {
  protected tableName = 'establishments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').notNullable()
      table.string('city').notNullable()
      table.string('address').notNullable()

      table.integer('user_id').references('users.id').onDelete('SET NULL').unique()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

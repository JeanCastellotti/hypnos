import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SuitesPictures extends BaseSchema {
  protected tableName = 'suites_pictures'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('small')
      table.string('large')

      table.integer('suite_id').references('suites.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

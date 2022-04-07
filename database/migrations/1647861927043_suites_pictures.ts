import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SuitesPictures extends BaseSchema {
  protected tableName = 'suites_pictures'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('filename').notNullable()
      table.string('extname').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EstablishmentsPictures extends BaseSchema {
  protected tableName = 'establishments_pictures'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('filename')
      table.string('extname')

      table.integer('establishment_id').references('establishments.id').unique().onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

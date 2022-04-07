import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EstablishmentsPictures extends BaseSchema {
  protected tableName = 'establishments_pictures'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('filename').notNullable()
      table.string('extname').notNullable()

      table
        .integer('establishment_id')
        .primary()
        .references('establishments.id')
        .unique()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

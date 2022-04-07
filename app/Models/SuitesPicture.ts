import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class SuitesPicture extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public filename: string

  @column()
  public extname: string

  @computed()
  public get small() {
    return `${this.filename}-sm.${this.extname}`
  }

  @computed()
  public get large() {
    return `${this.filename}-lg.${this.extname}`
  }
}

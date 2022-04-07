import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Establishment from './Establishment'

export default class EstablishmentsPicture extends BaseModel {
  @column({ isPrimary: true })
  public establishmentId: number

  @column()
  public filename: string

  @column()
  public extname: string

  @belongsTo(() => Establishment)
  public establishment: BelongsTo<typeof Establishment>

  @computed()
  public get small() {
    return `${this.filename}-sm.${this.extname}`
  }

  @computed()
  public get medium() {
    return `${this.filename}-md.${this.extname}`
  }

  @computed()
  public get large() {
    return `${this.filename}-lg.${this.extname}`
  }

  @computed()
  public get big() {
    return `${this.filename}-xl.${this.extname}`
  }
}

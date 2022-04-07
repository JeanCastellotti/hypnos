import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Establishment from './Establishment'

export default class EstablishmentsPicture extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public establishmentId: number

  @column()
  public filename: string

  @column()
  public extname: string

  @computed()
  public get small() {
    return `${this.filename}-small.${this.extname}`
  }

  @computed()
  public get medium() {
    return `${this.filename}-medium.${this.extname}`
  }

  @computed()
  public get large() {
    return `${this.filename}-large.${this.extname}`
  }

  @computed()
  public get big() {
    return `${this.filename}-big.${this.extname}`
  }

  @belongsTo(() => Establishment)
  public establishment: BelongsTo<typeof Establishment>
}

import { DateTime } from 'luxon'
import {
  afterDelete,
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Establishment from './Establishment'
import Drive from '@ioc:Adonis/Core/Drive'
import Booking from './Booking'

export default class Suite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public bookingUrl: string

  @column()
  public picture_1: string

  @column()
  public picture_2: string

  @column()
  public establishmentId: number

  @belongsTo(() => Establishment)
  public establishment: BelongsTo<typeof Establishment>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterDelete()
  public static async deletePictures(suite: Suite) {
    const [picture1Filename, picture1Extname] = suite.picture_1.split('.')
    const [picture2Filename, picture2Extname] = suite.picture_2.split('.')

    await Drive.delete(`${picture1Filename}-large.${picture1Extname}`)
    await Drive.delete(`${picture1Filename}-medium.${picture1Extname}`)
    await Drive.delete(`${picture1Filename}-small.${picture1Extname}`)

    await Drive.delete(`${picture2Filename}-large.${picture2Extname}`)
    await Drive.delete(`${picture2Filename}-medium.${picture2Extname}`)
    await Drive.delete(`${picture2Filename}-small.${picture2Extname}`)
  }
}

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
    await Drive.delete(suite.picture_1)
    await Drive.delete(suite.picture_2)
  }
}

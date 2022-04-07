import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Suite from './Suite'
import User from './User'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.date()
  public start: DateTime

  @column.date()
  public end: DateTime

  @column()
  public suiteId: number

  @column()
  public userId: number

  @belongsTo(() => Suite)
  public suite: BelongsTo<typeof Suite>

  @belongsTo(() => User)
  public customer: BelongsTo<typeof User>
}

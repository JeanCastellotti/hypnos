import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Suite from './Suite'

export default class Picture extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string

  @column()
  public suiteId: number

  @belongsTo(() => Suite)
  public suite: BelongsTo<typeof Suite>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

import { DateTime } from 'luxon'
import {
  afterDelete,
  BaseModel,
  beforeDelete,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Suite from './Suite'
import Drive from '@ioc:Adonis/Core/Drive'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class Establishment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public city: string

  @column()
  public address: string

  @column()
  public hero: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public manager: BelongsTo<typeof User>

  @hasMany(() => Suite)
  public suites: HasMany<typeof Suite>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async titleCase(establishment: Establishment) {
    establishment.name = string.capitalCase(establishment.name)
  }

  @beforeDelete()
  public static async deleteSuitesPictures(establishment: Establishment) {
    const suites = await establishment.related('suites').query()

    suites.forEach(async (suite) => {
      await Drive.delete(suite.picture_1)
      await Drive.delete(suite.picture_2)
    })
  }

  @afterDelete()
  public static async deleteHero(establishment: Establishment) {
    await Drive.delete(establishment.hero)
  }
}

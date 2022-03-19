import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Establishment from './Establishment'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public role: string

  @hasOne(() => Establishment)
  public establishment: HasOne<typeof Establishment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}

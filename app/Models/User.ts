import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Establishment from './Establishment'
import Hash from '@ioc:Adonis/Core/Hash'
import Booking from './Booking'
import Role from './Role'
import { string } from '@ioc:Adonis/Core/Helpers'

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
  public roleId: number

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasOne(() => Establishment)
  public establishment: HasOne<typeof Establishment>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>

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

  @beforeSave()
  public static async firstnameCase(user: User) {
    if (user.$dirty.firstname) {
      user.firstname = string.capitalCase(user.firstname)
    }
  }

  @beforeSave()
  public static async lastnameCase(user: User) {
    if (user.$dirty.lastname) {
      user.lastname = string.capitalCase(user.lastname)
    }
  }
}

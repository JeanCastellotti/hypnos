import { DateTime } from 'luxon'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Establishment from './Establishment'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column()
  public subject: string

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public establishmentId: number

  @belongsTo(() => Establishment)
  public establishment: BelongsTo<typeof Establishment>

  @beforeSave()
  public static async titleFirstname(message: Message) {
    message.firstname = string.capitalCase(message.firstname.toLowerCase())
  }

  @beforeSave()
  public static async titleLastname(message: Message) {
    message.lastname = string.capitalCase(message.lastname.toLowerCase())
  }
}

import {
  BaseModel,
  beforeDelete,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Establishment from './Establishment'
import Drive from '@ioc:Adonis/Core/Drive'
import Booking from './Booking'
import SuitesPicture from './SuitesPicture'

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
  public picture_1: number

  @column()
  public picture_2: number

  @column()
  public establishmentId: number

  @belongsTo(() => SuitesPicture, {
    foreignKey: 'picture_1',
  })
  public picture1: BelongsTo<typeof SuitesPicture>

  @belongsTo(() => SuitesPicture, {
    foreignKey: 'picture_2',
  })
  public picture2: BelongsTo<typeof SuitesPicture>

  @belongsTo(() => Establishment)
  public establishment: BelongsTo<typeof Establishment>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>

  @beforeDelete()
  public static async deletePictures(suite: Suite) {
    await suite.load('picture1')
    await suite.load('picture2')
    await Drive.delete(`${suite.picture1.filename}-sm.${suite.picture1.extname}`)
    await Drive.delete(`${suite.picture1.filename}-lg.${suite.picture1.extname}`)
    await Drive.delete(`${suite.picture2.filename}-sm.${suite.picture2.extname}`)
    await Drive.delete(`${suite.picture2.filename}-lg.${suite.picture2.extname}`)
    await suite.picture1.delete()
    await suite.picture2.delete()
  }
}

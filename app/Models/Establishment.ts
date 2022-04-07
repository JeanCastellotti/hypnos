import {
  BaseModel,
  beforeDelete,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Suite from './Suite'
import Drive from '@ioc:Adonis/Core/Drive'
import { string } from '@ioc:Adonis/Core/Helpers'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import EstablishmentsPicture from './EstablishmentsPicture'

export default class Establishment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name'],
  })
  public slug: string

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

  @hasOne(() => EstablishmentsPicture, {
    foreignKey: 'establishmentId',
  })
  public picture: HasOne<typeof EstablishmentsPicture>

  @beforeSave()
  public static async titleCase(establishment: Establishment) {
    if (establishment.$dirty.name) {
      establishment.name = string.titleCase(establishment.name.toLowerCase())
    }
  }

  @beforeSave()
  public static async cityCase(establishment: Establishment) {
    if (establishment.$dirty.city) {
      establishment.city = string.capitalCase(establishment.city)
    }
  }

  // @beforeDelete()
  // public static async deleteSuitesPictures(establishment: Establishment) {
  //   const suites = await establishment.related('suites').query()

  //   suites.forEach(async (suite) => {
  //     await Drive.delete(suite.picture_1)
  //     await Drive.delete(suite.picture_2)
  //   })
  // }

  @beforeDelete()
  public static async deletePicture(establishment: Establishment) {
    await establishment.load('picture')
    await Drive.delete(`${establishment.picture.filename}-xl.${establishment.picture.extname}`)
    await Drive.delete(`${establishment.picture.filename}-lg.${establishment.picture.extname}`)
    await Drive.delete(`${establishment.picture.filename}-md.${establishment.picture.extname}`)
    await Drive.delete(`${establishment.picture.filename}-sm.${establishment.picture.extname}`)
  }
}

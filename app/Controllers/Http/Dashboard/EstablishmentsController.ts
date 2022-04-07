import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import User from 'App/Models/User'
import EstablishmentValidator from 'App/Validators/EstablishmentValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import EstablishmentUpdateValidator from 'App/Validators/EstablishmentUpdateValidator'
import sharp from 'sharp'
import Role from 'App/Enums/Roles'
import EstablishmentsPicture from 'App/Models/EstablishmentsPicture'

export default class EstablishmentsController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewEstablishments')
    const establishments = await Establishment.all()
    return view.render('dashboard/establishments/index', { establishments })
  }

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('createEstablishment')
    const managers = await User.query().where('roleId', Role.MANAGER)
    return view.render('dashboard/establishments/create', { managers })
  }

  public async store({ request, response, session, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('storeEstablishment')
    const { hero, ...data } = await request.validate(EstablishmentValidator)

    const filename = string.generateRandom(32)
    const extname = hero.extname

    try {
      const establishment = await Establishment.create({ ...data })

      await EstablishmentsPicture.create({
        establishmentId: establishment.id,
        filename,
        extname: hero.extname,
      })

      const resizedImageBig = await sharp(hero.tmpPath).resize(1920).toBuffer()
      const resizedImageLarge = await sharp(hero.tmpPath).resize(1280).toBuffer()
      const resizedImageMedium = await sharp(hero.tmpPath).resize(768).toBuffer()
      const resizedImageSmall = await sharp(hero.tmpPath).resize(640).toBuffer()

      await Drive.put(`${filename}-xl.${extname}`, resizedImageBig)
      await Drive.put(`${filename}-lg.${extname}`, resizedImageLarge)
      await Drive.put(`${filename}-md.${extname}`, resizedImageMedium)
      await Drive.put(`${filename}-sm.${extname}`, resizedImageSmall)
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la création de l'établissement")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été créé")
    return response.redirect().toRoute('dashboard.establishments.index')
  }

  public async edit({ view, params, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('editEstablishment')
    const establishment = await Establishment.findOrFail(params.id)
    const managers = await User.query().where('roleId', Role.MANAGER)
    return view.render('dashboard/establishments/edit', { establishment, managers })
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('updateEstablishment')
    const { hero, ...data } = await request.validate(EstablishmentUpdateValidator)
    const establishment = await Establishment.findOrFail(params.id)

    try {
      if (hero) {
        const filename = string.generateRandom(32)
        const extname = hero.extname!

        await establishment.load('picture')
        await Drive.delete(`${establishment.picture.filename}-xl.${establishment.picture.extname}`)
        await Drive.delete(`${establishment.picture.filename}-lg.${establishment.picture.extname}`)
        await Drive.delete(`${establishment.picture.filename}-md.${establishment.picture.extname}`)
        await Drive.delete(`${establishment.picture.filename}-sm.${establishment.picture.extname}`)

        const resizedImageBig = await sharp(hero.tmpPath).resize(1920).toBuffer()
        const resizedImageLarge = await sharp(hero.tmpPath).resize(1280).toBuffer()
        const resizedImageMedium = await sharp(hero.tmpPath).resize(768).toBuffer()
        const resizedImageSmall = await sharp(hero.tmpPath).resize(640).toBuffer()

        await Drive.put(`${filename}-xl.${extname}`, resizedImageBig)
        await Drive.put(`${filename}-lg.${extname}`, resizedImageLarge)
        await Drive.put(`${filename}-md.${extname}`, resizedImageMedium)
        await Drive.put(`${filename}-sm.${extname}`, resizedImageSmall)

        establishment.picture.merge({ filename, extname }).save()
      }

      await establishment.merge({ ...data }).save()
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la modification de l'établissement")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été modifié.")
    return response.redirect().toRoute('dashboard.establishments.index')
  }

  public async delete({ params, view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('deleteEstablishment')
    const establishment = await Establishment.findOrFail(params.id)
    return view.render('dashboard/establishments/delete', { establishment })
  }

  public async destroy({ params, session, response, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('destroyEstablishment')
    const establishment = await Establishment.findOrFail(params.id)

    try {
      await establishment.delete()
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la suppression de l'établissement.")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été supprimé.")
    return response.redirect().toRoute('dashboard.establishments.index')
  }
}

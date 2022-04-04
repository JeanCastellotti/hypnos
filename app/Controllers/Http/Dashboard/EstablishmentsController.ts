import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import User from 'App/Models/User'
import EstablishmentValidator from 'App/Validators/EstablishmentValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import EstablishmentUpdateValidator from 'App/Validators/EstablishmentUpdateValidator'

export default class EstablishmentsController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewEstablishments')
    const establishments = await Establishment.all()
    return view.render('pages/dashboard/establishments/index', { establishments })
  }

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('createEstablishment')
    const managers = await User.query().where('role', 'manager')
    return view.render('pages/dashboard/establishments/create', { managers })
  }

  public async store({ request, response, session, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('storeEstablishment')
    const { hero, ...data } = await request.validate(EstablishmentValidator)
    const filename = string.generateRandom(32) + '.' + hero.extname

    try {
      await hero.moveToDisk('./', { name: filename })
      await Establishment.create({ ...data, hero: filename })
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
    const managers = await User.query().where('role', 'manager')
    return view.render('pages/dashboard/establishments/edit', { establishment, managers })
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('updateEstablishment')
    const { hero, ...data } = await request.validate(EstablishmentUpdateValidator)
    const establishment = await Establishment.findOrFail(params.id)

    try {
      if (hero) {
        const filename = string.generateRandom(32) + '.' + hero.extname
        await Drive.delete(establishment.hero)
        await hero.moveToDisk('./', { name: filename })
        establishment.hero = filename
      }

      await establishment.merge({ ...data }).save()
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la modification de l'établissement")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été modifié")
    return response.redirect().toRoute('dashboard.establishments.index')
  }

  public async delete({ params, view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('deleteEstablishment')
    const establishment = await Establishment.findOrFail(params.id)
    return view.render('pages/dashboard/establishments.delete', { establishment })
  }

  public async destroy({ params, session, response, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('destroyEstablishment')
    const establishment = await Establishment.findOrFail(params.id)

    try {
      await establishment.delete()
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la suppression de l'établissement")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été supprimé")
    return response.redirect().toRoute('dashboard.establishments.index')
  }
}

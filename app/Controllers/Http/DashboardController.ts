import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import User from 'App/Models/User'
import ManagerValidator from 'App/Validators/ManagerValidator'
import ManagerUpdateValidator from 'App/Validators/ManagerUpdateValidator'
import EstablishmentValidator from 'App/Validators/EstablishmentValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import EstablishmentUpdateValidator from 'App/Validators/EstablishmentUpdateValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class DashboardController {
  public async establishments({ view }: HttpContextContract) {
    const establishments = await Establishment.all()
    return view.render('dashboard/establishments/index', { establishments })
  }

  public async createEstablishment({ view }: HttpContextContract) {
    const managers = await User.query().where('role', 'manager')
    return view.render('dashboard/establishments/create', { managers })
  }

  public async storeEstablishment({ request, response, session }: HttpContextContract) {
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
    return response.redirect().toRoute('dashboard.establishments')
  }

  public async editEstablishment({ view, params }: HttpContextContract) {
    const establishment = await Establishment.findOrFail(params.id)
    const managers = await User.query().where('role', 'manager')
    return view.render('dashboard/establishments/edit', { establishment, managers })
  }

  public async updateEstablishment({ request, response, params, session }: HttpContextContract) {
    const { hero, ...data } = await request.validate(EstablishmentUpdateValidator)
    const establishment = await Establishment.findOrFail(params.id)

    try {
      if (hero) {
        const filename = string.generateRandom(32) + '.' + hero.extname
        await Drive.delete(establishment.hero)
        await hero.moveToDisk('./', { name: filename })
        establishment.hero = filename
      }
      await establishment?.merge({ ...data }).save()
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la modification de l'établissement")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été modifié")
    return response.redirect().toRoute('dashboard.establishments')
  }

  public async destroyEstablishment({ params, session, response }: HttpContextContract) {
    const establishment = await Establishment.findOrFail(params.id)

    try {
      await establishment.delete()
      await Drive.delete(establishment.hero)
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la suppression de l'établissement")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été supprimé")
    return response.redirect().toRoute('dashboard.establishments')
  }

  public async managers({ view }: HttpContextContract) {
    const managers = await User.query().where('role', 'manager')
    return view.render('dashboard/managers/index', { managers })
  }

  public async storeManager({ request, response, session }: HttpContextContract) {
    const data = await request.validate(ManagerValidator)

    try {
      await User.create({ ...data, role: 'manager' })
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la création du gérant')
      return response.redirect().back()
    }

    session.flash('success', 'Le gérant a bien été créé')
    return response.redirect().toRoute('dashboard.managers')
  }

  public async editManager({ view, params }: HttpContextContract) {
    const manager = await User.find(params.id)
    return view.render('dashboard/managers/edit', { manager })
  }

  public async updateManager({ request, response, params, session }: HttpContextContract) {
    const data = await request.validate(ManagerUpdateValidator)
    const manager = await User.findOrFail(params.id)

    try {
      await manager.merge({ ...data }).save()
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la modification du gérant')
      return response.redirect().back()
    }

    session.flash('success', 'Le gérant a bien été modifié')
    return response.redirect().toRoute('dashboard.managers')
  }

  public async destroyManager({ params, response, session }: HttpContextContract) {
    const manager = await User.findOrFail(params.id)

    try {
      await manager.delete()
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la suppression du gérant')
      return response.redirect().back()
    }

    session.flash('success', 'Le gérant a bien été supprimé')
    return response.redirect().toRoute('dashboard.managers')
  }
}

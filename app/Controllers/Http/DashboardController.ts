import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import User from 'App/Models/User'
import ManagerValidator from 'App/Validators/ManagerValidator'
import ManagerUpdateValidator from 'App/Validators/ManagerUpdateValidator'
import EstablishmentValidator from 'App/Validators/EstablishmentValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import EstablishmentUpdateValidator from 'App/Validators/EstablishmentUpdateValidator'
import Drive from '@ioc:Adonis/Core/Drive'
import Suite from 'App/Models/Suite'
import SuiteValidator from 'App/Validators/SuiteValidator'
import SuiteUpdateValidator from 'App/Validators/SuiteUpdateValidator'

export default class DashboardController {
  public async establishments({ view }: HttpContextContract) {
    const establishments = await Establishment.all()
    return view.render('pages/dashboard/establishments/index', { establishments })
  }

  public async createEstablishment({ view }: HttpContextContract) {
    const managers = await User.query().where('role', 'manager')
    return view.render('pages/dashboard/establishments/create', { managers })
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
    return response.redirect().toRoute('dashboard.establishments.index')
  }

  public async editEstablishment({ view, params }: HttpContextContract) {
    const establishment = await Establishment.findOrFail(params.id)
    const managers = await User.query().where('role', 'manager')
    return view.render('pages/dashboard/establishments/edit', { establishment, managers })
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

      await establishment.merge({ ...data }).save()
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la modification de l'établissement")
      return response.redirect().back()
    }

    session.flash('success', "L'établissement a bien été modifié")
    return response.redirect().toRoute('dashboard.establishments.index')
  }

  public async deleteEstablishment({ params, view }: HttpContextContract) {
    const establishment = await Establishment.findOrFail(params.id)
    return view.render('pages/dashboard/establishments.delete', { establishment })
  }

  public async destroyEstablishment({ params, session, response }: HttpContextContract) {
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

  public async managers({ view }: HttpContextContract) {
    const managers = await User.query().where('role', 'manager')
    return view.render('pages/dashboard/managers/index', { managers })
  }

  public async createManager({ view }: HttpContextContract) {
    return view.render('pages/dashboard/managers/create')
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
    return response.redirect().toRoute('dashboard.managers.index')
  }

  public async editManager({ view, params }: HttpContextContract) {
    const manager = await User.find(params.id)
    return view.render('pages/dashboard/managers/edit', { manager })
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
    return response.redirect().toRoute('dashboard.managers.index')
  }

  public async deleteManager({ params, view }: HttpContextContract) {
    const manager = await User.findOrFail(params.id)
    return view.render('pages/dashboard/managers/delete', { manager })
  }

  public async destroyManager({ response, params, session }: HttpContextContract) {
    const manager = await User.findOrFail(params.id)

    try {
      await manager.delete()
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la suppression du gérant')
      return response.redirect().back()
    }

    session.flash('success', 'Le gérant a bien été supprimé')
    return response.redirect().toRoute('dashboard.managers.index')
  }

  public async suites({ view }: HttpContextContract) {
    const suites = await Suite.all()
    return view.render('pages/dashboard/suites/index', { suites })
  }

  public async createSuite({ view }: HttpContextContract) {
    return view.render('pages/dashboard/suites/create')
  }

  public async storeSuite({ request, response, session }) {
    const { picture1, picture2, ...data } = await request.validate(SuiteValidator)
    const filename1 = string.generateRandom(32) + '.' + picture1.extname
    const filename2 = string.generateRandom(32) + '.' + picture2.extname
    const establishment = await Establishment.firstOrFail()

    try {
      await Suite.create({
        ...data,
        establishmentId: establishment.id,
        picture_1: filename1,
        picture_2: filename2,
      })
      await picture1.moveToDisk('./', { name: filename1 })
      await picture2.moveToDisk('./', { name: filename2 })
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la création de la suite')
      return response.redirect().back()
    }

    session.flash('success', 'La suite a bien été créée')
    return response.redirect().toRoute('dashboard.suites.index')
  }

  public async editSuite({ params, view }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)
    return view.render('pages/dashboard/suites/edit', { suite })
  }

  public async updateSuite({ request, response, params, session }: HttpContextContract) {
    const { picture1, picture2, ...data } = await request.validate(SuiteUpdateValidator)
    const suite = await Suite.findOrFail(params.id)

    try {
      if (picture1) {
        const filename = string.generateRandom(32) + '.' + picture1.extname
        await Drive.delete(suite.picture_1)
        await picture1.moveToDisk('./', { name: filename })
        suite.picture_1 = filename
      }

      if (picture2) {
        const filename = string.generateRandom(32) + '.' + picture2.extname
        await Drive.delete(suite.picture_2)
        await picture2.moveToDisk('./', { name: filename })
        suite.picture_2 = filename
      }

      await suite.merge({ ...data }).save()
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la modification de la suite')
      return response.redirect().back()
    }

    session.flash('success', 'La suite a bien été modifiée')
    return response.redirect().toRoute('dashboard.suites.index')
  }

  public async deleteSuite({ params, view }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)
    return view.render('pages/dashboard/suites/delete', { suite })
  }

  public async destroySuite({ params, response, session }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)

    try {
      await suite.delete()
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la suppression de la suite')
      return response.redirect().back()
    }

    session.flash('success', 'La suite a bien été supprimée')
    return response.redirect().toRoute('dashboard.suites.index')
  }
}

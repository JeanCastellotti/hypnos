import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Suite from 'App/Models/Suite'
import SuiteValidator from 'App/Validators/SuiteValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import SuiteUpdateValidator from 'App/Validators/SuiteUpdateValidator'
import Establishment from 'App/Models/Establishment'
import Role from 'App/Enums/Roles'

export default class SuitesController {
  public async index({ view, bouncer, auth }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewSuites')
    const establishment = await Establishment.query().where('user_id', auth.user!.id).first()
    const suites = await establishment?.related('suites').query()
    return view.render('pages/dashboard/suites/index', { suites })
  }

  public async create({ view, response, session, auth, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('createSuite')
    const establishment = await auth.user!.related('establishment').query().first()
    const establishments = await Establishment.all()

    if (!establishment && auth.user!.role !== Role.ADMIN) {
      session.flash(
        'error',
        "Vous n'avez pas encore la possibilité de créer une suite. Si le problème persiste, contactez l'administrateur."
      )
      return response.redirect().back()
    }

    return view.render('pages/dashboard/suites/create', { establishments })
  }

  public async store({ request, response, session, auth, bouncer }) {
    await bouncer.with('DashboardPolicy').authorize('storeSuite')
    const { picture1, picture2, ...data } = await request.validate(SuiteValidator)
    const filename1 = string.generateRandom(32) + '.' + picture1.extname
    const filename2 = string.generateRandom(32) + '.' + picture2.extname
    const establishment = await auth.user.related('establishment').query().first()

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

  public async edit({ params, view, bouncer }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('editSuite', suite)

    return view.render('pages/dashboard/suites/edit', { suite })
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    const { picture1, picture2, ...data } = await request.validate(SuiteUpdateValidator)

    const suite = await Suite.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('updateSuite', suite)

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

  public async delete({ params, view, bouncer }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('deleteSuite', suite)

    return view.render('pages/dashboard/suites/delete', { suite })
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('destroySuite', suite)

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

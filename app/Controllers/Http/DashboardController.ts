import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import User from 'App/Models/User'
import ManagerValidator from 'App/Validators/ManagerValidator'
import ManagerUpdateValidator from 'App/Validators/ManagerUpdateValidator'

export default class DashboardController {
  public async establishments({ view }: HttpContextContract) {
    const establishments = await Establishment.all()
    return view.render('dashboard/establishments', { establishments })
  }

  public async managers({ view }: HttpContextContract) {
    const managers = await User.query().where('role', 'manager')
    return view.render('dashboard/managers', { managers })
  }

  public async storeManager({ request, response, session }: HttpContextContract) {
    const data = await request.validate(ManagerValidator)

    try {
      await User.create({ ...data, role: 'manager' })
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la création du gérant')
    }

    session.flash('success', 'Le gérant a bien été créé')
    return response.redirect().toRoute('dashboard.managers')
  }

  public async showManager({ view, params }: HttpContextContract) {
    const manager = await User.find(params.id)
    return view.render('dashboard/edit-manager', { manager })
  }

  public async updateManager({ request, response, params, session }: HttpContextContract) {
    const data = await request.validate(ManagerUpdateValidator)

    const manager = await User.find(params.id)
    await manager?.merge({ ...data }).save()
    session.flash('success', 'Le gérant a bien été modifié')
    return response.redirect().toRoute('dashboard.managers')
  }

  public async destroyManager({ params, response, session }: HttpContextContract) {
    const manager = await User.find(params.id)
    await manager?.delete()
    session.flash('success', 'Le gérant a bien été supprimé')
    return response.redirect().toRoute('dashboard.managers')
  }
}

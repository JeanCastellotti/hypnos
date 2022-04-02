import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ManagerUpdateValidator from 'App/Validators/ManagerUpdateValidator'
import ManagerValidator from 'App/Validators/ManagerValidator'

export default class ManagersController {
  public async index({ view }: HttpContextContract) {
    const managers = await User.query().where('role', 'manager')
    return view.render('pages/dashboard/managers/index', { managers })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/dashboard/managers/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
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

  public async edit({ view, params }: HttpContextContract) {
    const manager = await User.find(params.id)
    return view.render('pages/dashboard/managers/edit', { manager })
  }

  public async update({ request, response, params, session }: HttpContextContract) {
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

  public async delete({ params, view }: HttpContextContract) {
    const manager = await User.findOrFail(params.id)
    return view.render('pages/dashboard/managers/delete', { manager })
  }

  public async destroy({ response, params, session }: HttpContextContract) {
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
}

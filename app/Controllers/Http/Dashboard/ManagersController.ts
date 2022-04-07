import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Enums/Roles'
import User from 'App/Models/User'
import ManagerUpdateValidator from 'App/Validators/ManagerUpdateValidator'
import ManagerValidator from 'App/Validators/ManagerValidator'

export default class ManagersController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewManagers')
    const managers = await User.query().where('roleId', Role.MANAGER)
    return view.render('dashboard/managers/index', { managers })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('dashboard/managers/create')
  }

  public async store({ request, response, session, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewManagers')

    const data = await request.validate(ManagerValidator)

    try {
      await User.create({ ...data, roleId: Role.MANAGER })
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la création du gérant')
      return response.redirect().back()
    }

    session.flash('success', 'Le gérant a bien été créé')
    return response.redirect().toRoute('dashboard.managers.index')
  }

  public async edit({ view, params }: HttpContextContract) {
    const manager = await User.find(params.id)
    return view.render('dashboard/managers/edit', { manager })
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
    return view.render('dashboard/managers/delete', { manager })
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

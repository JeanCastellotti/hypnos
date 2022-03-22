import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import User from 'App/Models/User'
import AdminValidator from 'App/Validators/AdminValidator'

export default class AppsController {
  public async createAdmin({ response, view }: HttpContextContract) {
    const admin = await User.findBy('role', 'admin')

    if (admin) {
      return response.redirect().toRoute('home')
    }

    return view.render('admin/index')
  }

  public async storeAdmin({ request, response, session }: HttpContextContract) {
    const data = await request.validate(AdminValidator)

    try {
      await User.create({ ...data, role: 'admin' })
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la création de l'administrateur")
      return response.redirect().back()
    }

    session.flash('success', "L'administrateur a bien été créé")
    return response.redirect().toRoute('auth.login')
  }
}

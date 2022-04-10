import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class SettingsController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewSettings')
    return view.render('dashboard/settings/index')
  }

  public async update({ request, response, session, auth, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('updateSettings')
    const data = await request.validate(UserValidator)
    const user = await User.findOrFail(auth.user!.id)
    await user.merge(data).save()
    session.flash('success', 'Votre compte a été mise à jour')
    return response.redirect().toRoute('dashboard.settings.index')
  }
}

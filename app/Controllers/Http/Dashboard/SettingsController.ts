import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SettingsController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewSettings')
    return view.render('dashboard/settings/index')
  }
}

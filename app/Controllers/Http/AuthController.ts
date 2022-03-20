import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'

export default class AuthController {
  public async login({ request, response, auth, session }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)
    try {
      await auth.attempt(email, password)
    } catch (error) {
      session.flash('error', 'Email ou mot de passe incorrect')
      return response.redirect().back()
    }

    session.flash('success', 'Vous êtes connecté')
    return response.redirect().toRoute('dashboard.index')
  }

  public async logout({ auth, session, response }: HttpContextContract) {
    await auth.logout()
    session.flash('success', 'Vous avez été déconnecté')
    return response.redirect().toRoute('auth.login')
  }
}

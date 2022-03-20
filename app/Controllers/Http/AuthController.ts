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

    session.flash('succes', 'Vous êtes connecté')
    return response.redirect('/dasboard')
  }
}

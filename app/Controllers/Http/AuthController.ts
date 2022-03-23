import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

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

  public async signup({ request, response, session }: HttpContextContract) {
    const data = await request.validate(SignupValidator)

    try {
      await User.create({ ...data, role: 'customer' })
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la création de votre compte')
      return response.redirect().back()
    }

    session.flash('success', 'Votre compte a bien été créé')
    return response.redirect().toRoute('auth.login')
  }

  public async logout({ auth, session, response }: HttpContextContract) {
    await auth.logout()
    session.flash('success', 'Vous avez été déconnecté')
    return response.redirect().toRoute('auth.login')
  }
}

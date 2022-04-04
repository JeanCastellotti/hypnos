import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Enums/Roles'
import Booking from 'App/Models/Booking'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

export default class AuthController {
  public async showLogin({ view }: HttpContextContract) {
    return view.render('pages/auth/login')
  }

  public async login({ request, response, auth, session, bouncer }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)

    try {
      await auth.attempt(email, password)
    } catch (error) {
      session.flash('error', 'Email ou mot de passe incorrect')
      return response.redirect().back()
    }

    if (session.has('booking')) {
      await bouncer.with('DashboardPolicy').authorize('storeBooking')
      const { suite: suiteId, from, to } = session.get('booking')
      await Booking.create({ suiteId, from, to, userId: auth.user?.id })
      session.flash('success', 'La réservation a bien été enregistrée')
      session.forget('booking')
      return response.redirect().toRoute('dashboard.index')
    }

    session.flash('success', 'Vous êtes connecté')
    return response.redirect().toRoute('dashboard.index')
  }

  public async showSignup({ view }: HttpContextContract) {
    return view.render('pages/auth/signup')
  }

  public async signup({ request, response, session }: HttpContextContract) {
    const data = await request.validate(SignupValidator)

    try {
      await User.create({ ...data, role: Role.USER })
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

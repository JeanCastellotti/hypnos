import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Enums/Roles'
import Booking from 'App/Models/Booking'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

export default class AuthController {
  public async showLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async login({ request, response, auth, session, bouncer }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)

    try {
      await auth.attempt(email, password)
      session.flash('success', 'Vous êtes connecté')
    } catch (error) {
      session.flash('error', 'Email ou mot de passe incorrect')
      return response.redirect().back()
    }

    if (session.has('booking')) {
      try {
        await bouncer.with('DashboardPolicy').authorize('storeBooking')
        const { suite: suiteId, start, end } = session.get('booking')
        await Booking.create({ suiteId, start, end, userId: auth.user?.id })
      } catch (error) {
        session.flash('error', 'Un problème est survenu lors de la création de la réservation')
        return response.redirect().toRoute('bookings.create')
      } finally {
        session.forget('booking')
      }

      session.flash('success', 'La réservation a bien été enregistrée')
      return response.redirect().toRoute('dashboard.bookings.index')
    }

    let redirect = 'dashboard.settings.index'

    if (auth.user!.roleId === Role.ADMIN) redirect = 'dashboard.establishments.index'
    else if (auth.user!.roleId === Role.MANAGER) redirect = 'dashboard.suites.index'

    return response.redirect().toRoute(redirect)
  }

  public async showSignup({ view }: HttpContextContract) {
    return view.render('auth/signup')
  }

  public async signup({ request, response, session }: HttpContextContract) {
    const data = await request.validate(SignupValidator)

    try {
      await User.create({ ...data, roleId: Role.USER })
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

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Establishment from 'App/Models/Establishment'
import Suite from 'App/Models/Suite'
import BookingValidator from 'App/Validators/BookingValidator'
import { DateTime } from 'luxon'

export default class BookingsController {
  public async index({ view, auth }: HttpContextContract) {
    const bookings = await auth.user
      ?.related('bookings')
      .query()
      .preload('suite', (suiteQuery) => {
        suiteQuery.preload('establishment')
      })

    return view.render('pages/dashboard/bookings/index', { bookings })
  }

  public async create({ request, view, session }: HttpContextContract) {
    session.forget('booking')
    const { establishment: establishmentQuery, suite: suiteQuery } = request.qs()
    const establishments = await Establishment.query().select('id', 'name').orderBy('name')
    const establishment = establishmentQuery && (await Establishment.find(establishmentQuery))
    const suites =
      establishment && (await establishment.related('suites').query().select('id', 'title'))

    return view.render('pages/bookings/create', {
      establishments,
      suites,
      currentEstablishment: establishment?.id,
      currentSuite: +suiteQuery,
    })
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const { establishment, ...data } = await request.validate(BookingValidator)

    const suite = await Suite.find(data.suite)
    const bookings = await suite?.related('bookings').query()
    const start = DateTime.fromISO(data.from.toString())
    const end = DateTime.fromISO(data.to.toString())

    const suiteIsAvailable = !bookings?.some(
      (booking) =>
        (start >= booking.from && start <= booking.to) ||
        (booking.from >= start && booking.from <= end)
    )

    if (!suiteIsAvailable) {
      session.flash('formError', "La suite n'est pas disponible aux dates indiquées")
      return response.redirect().withQs().back()
    }

    if (!auth.isLoggedIn) {
      session.put('booking', data)
      return response.header('hx-redirect', '/login')
    }

    try {
      await Booking.create({
        suiteId: data.suite,
        userId: auth.user?.id,
        from: data.from,
        to: data.to,
      })
    } catch (error) {
      session.flash('formError', 'Un problème est survenu lors de la création de la réservation')
      return response.redirect().withQs().back()
    }

    session.flash('success', 'Votre réservation a bien été enregistrée')
    return response.header('hx-redirect', '/')
  }

  public async delete({ params, view }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)
    return view.render('pages/dashboard/bookings/delete', { booking })
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)

    try {
      await booking.delete()
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de l'annulation de la réservation")
      return response.redirect().back()
    }

    session.flash('success', 'Votre réservation a bien été annulée')
    return response.redirect().toRoute('dashboard.bookings.index')
  }
}

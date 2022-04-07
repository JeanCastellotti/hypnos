import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Establishment from 'App/Models/Establishment'
import Suite from 'App/Models/Suite'
import BookingValidator from 'App/Validators/BookingValidator'
import { DateTime, Interval } from 'luxon'

export default class BookingsController {
  public async create({ request, view, session }: HttpContextContract) {
    session.forget('booking')
    const { establishment: establishmentQuery, suite: suiteQuery } = request.qs()
    const establishments = await Establishment.query().select('id', 'name').orderBy('name')
    const establishment = establishmentQuery && (await Establishment.find(establishmentQuery))
    const suites =
      establishment && (await establishment.related('suites').query().select('id', 'title'))

    return view.render('bookings/create', {
      establishments,
      suites,
      currentEstablishment: establishment?.id,
      currentSuite: +suiteQuery,
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    const { establishment, ...data } = await request.validate(BookingValidator)

    const suite = await Suite.find(data.suite)
    const bookings = await suite?.related('bookings').query()
    const start = DateTime.fromISO(data.start.toString())
    const end = DateTime.fromISO(data.end.toString())
    const bookingPeriod = Interval.fromDateTimes(start, end)

    const suiteNotAvailable = bookings?.some((booking) => {
      const period = Interval.fromDateTimes(booking.start, booking.end)
      return period.overlaps(bookingPeriod) || period.equals(bookingPeriod)
    })

    if (suiteNotAvailable) {
      session.flash('formError', "La suite n'est pas disponible aux dates indiquées.")
      return response.redirect().withQs().back()
    }

    if (!auth.isLoggedIn) {
      session.put('booking', data)
      return response.header('hx-redirect', '/login')
    }

    try {
      await bouncer.with('DashboardPolicy').authorize('storeBooking')
      await Booking.create({
        suiteId: data.suite,
        userId: auth.user?.id,
        start: data.start,
        end: data.end,
      })
    } catch (error) {
      session.flash('formError', 'Un problème est survenu lors de la création de la réservation')
      return response.redirect().withQs().back()
    }

    session.flash('success', 'Votre réservation a bien été enregistrée')
    return response.header('hx-redirect', '/dashboard/bookings')
  }
}

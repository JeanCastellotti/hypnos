import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Establishment from 'App/Models/Establishment'
import Suite from 'App/Models/Suite'
import BookingValidator from 'App/Validators/BookingValidator'
import { DateTime, Interval } from 'luxon'
import Route from '@ioc:Adonis/Core/Route'

export default class BookingsController {
  public async create({ request, view }: HttpContextContract) {
    // session.forget('booking')
    const { establishment: establishmentQuery, suite: suiteQuery, start, end } = request.qs()
    const establishments = await Establishment.query().select('id', 'name').orderBy('name')
    const establishment = establishmentQuery && (await Establishment.find(establishmentQuery))
    const suites =
      establishment && (await establishment.related('suites').query().select('id', 'title'))

    return view.render('bookings/create', {
      establishments,
      suites,
      currentEstablishment: establishment?.id,
      currentSuite: +suiteQuery,
      start,
      end,
    })
  }

  public async check({ request, response, session }: HttpContextContract) {
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
      session.flash('form.error', `La suite n'est pas disponible.`)
      session.forget('booking')
    } else {
      session.put('booking', data)
      session.flash('form.success', `La suite est disponible.`)
    }
    return response.redirect().withQs().back()
  }

  public async store({ response, session, auth, bouncer }: HttpContextContract) {
    if (!session.has('booking')) return response.redirect().withQs().toRoute('bookings.create')

    if (!auth.isLoggedIn) return response.header('hx-redirect', Route.makeUrl('auth.login'))

    try {
      await bouncer.with('DashboardPolicy').authorize('storeBooking')
      const { suite: suiteId, start, end } = session.get('booking')
      await Booking.create({ suiteId, start, end, userId: auth.user?.id })
      session.flash('success', 'La réservation a bien été enregistrée.')
    } catch (error) {
      session.flash('error', 'Un problème est survenu lors de la création de la réservation')
      return response.header('hx-redirect', Route.makeUrl('bookings.create'))
    } finally {
      session.forget('booking')
    }

    session.flash('success', 'Votre réservation a bien été enregistrée')
    return response.header('hx-redirect', Route.makeUrl('dashboard.bookings.index'))
  }
}

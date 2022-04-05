import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'

export default class BookingsController {
  public async index({ view, auth, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewBookings')

    const bookings = await auth
      .user!.related('bookings')
      .query()
      .preload('suite', (query) => {
        query.preload('establishment')
      })
      .orderBy('to', 'desc')

    return view.render('pages/dashboard/bookings/index', { bookings })
  }

  public async delete({ params, view, bouncer }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('deleteBooking', booking)

    return view.render('pages/dashboard/bookings/delete', { booking })
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)

    await bouncer.with('DashboardPolicy').authorize('destroyBooking', booking)

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

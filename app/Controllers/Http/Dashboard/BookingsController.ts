import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
}

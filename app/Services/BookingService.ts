import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class BookingService {
  public async store() {
    const ctx = HttpContext.get()
    console.log(ctx?.request.url())
  }
}

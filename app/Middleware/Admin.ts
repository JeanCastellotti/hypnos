import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ request, auth, response }: HttpContextContract, next: () => Promise<void>) {
    console.log(request.url(), request.method())
    if (auth.user?.role !== 'admin') {
      console.log(response)

      // return response.redirect().back()
    }
    await next()
  }
}

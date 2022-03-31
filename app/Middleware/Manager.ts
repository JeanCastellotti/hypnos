import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Manager {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user?.role !== 'manager') {
      return response.redirect().back()
    }
    await next()
  }
}

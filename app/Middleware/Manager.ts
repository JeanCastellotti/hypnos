import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Enums/Roles'

export default class Manager {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user?.roleId !== Role.MANAGER) {
      return response.redirect().back()
    }
    await next()
  }
}

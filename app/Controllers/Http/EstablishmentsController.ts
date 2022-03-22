import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class EstablishmentsController {
  public async show({ params, view }: HttpContextContract) {
    const name = string.capitalCase(params.name)
    const establishment = await Establishment.findByOrFail('name', name)
    await establishment.load('suites')

    return view.render('establishments/show', { establishment })
  }
}

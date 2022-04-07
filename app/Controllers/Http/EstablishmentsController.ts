import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
// import Drive from '@ioc:Adonis/Core/Drive'

export default class EstablishmentsController {
  public async show({ params, view }: HttpContextContract) {
    const establishment = await Establishment.findByOrFail('slug', params.slug)
    await establishment.load('suites')
    await establishment.load('picture')

    for (const suite of establishment.suites) {
      await suite.load('picture1')
      await suite.load('picture2')
    }

    return view.render('establishments/show', { establishment })
  }
}

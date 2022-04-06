import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import { string } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'

export default class EstablishmentsController {
  public async show({ params, view }: HttpContextContract) {
    const name = string.capitalCase(params.name)
    const establishment = await Establishment.findByOrFail('name', name)
    await establishment.load('suites')

    const [heroFilename, heroExtname] = establishment.hero.split('.')

    const big = await Drive.getUrl(`${heroFilename}-big.${heroExtname}`)
    const large = await Drive.getUrl(`${heroFilename}-large.${heroExtname}`)
    const medium = await Drive.getUrl(`${heroFilename}-medium.${heroExtname}`)
    const small = await Drive.getUrl(`${heroFilename}-small.${heroExtname}`)

    for (const suite of establishment.suites) {
      const [filename1, extname1] = suite.picture_1.split('.')
      const [filename2, extname2] = suite.picture_2.split('.')
      suite.picture_1 = await Drive.getUrl(`${filename1}-small.${extname1}`)
      suite.picture_2 = await Drive.getUrl(`${filename2}-small.${extname2}`)
    }

    return view.render('pages/establishments/show', {
      establishment,
      hero: { small, medium, large, big },
    })
  }
}

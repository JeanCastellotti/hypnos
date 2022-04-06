import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Enums/Roles'
import Establishment from 'App/Models/Establishment'
import Suite from 'App/Models/Suite'
import User from 'App/Models/User'
import AdminValidator from 'App/Validators/AdminValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class AppController {
  public async createAdmin({ response, view }: HttpContextContract) {
    const admin = await User.findBy('role', Role.ADMIN)

    if (admin) {
      return response.redirect().toRoute('app.home')
    }

    return view.render('pages/admin/index')
  }

  public async storeAdmin({ request, response, session }: HttpContextContract) {
    const data = await request.validate(AdminValidator)

    try {
      await User.create({ ...data, role: Role.ADMIN })
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de la création de l'administrateur")
      return response.redirect().back()
    }

    session.flash('success', "L'administrateur a bien été créé")
    return response.redirect().toRoute('auth.login')
  }

  public async main({ view }: HttpContextContract) {
    const establishments = await Establishment.all()

    for (const establishment of establishments) {
      const [filename, extname] = establishment.hero.split('.')
      establishment.hero = await Drive.getUrl(`${filename}-small.${extname}`)
    }

    return view.render('pages/index', { establishments })
  }

  public async suites({ request, view }: HttpContextContract) {
    const { establishment: id } = await request.body()
    const suites = await Suite.query().select('id', 'title').where('establishment_id', id)
    return view.render('htmx/suites', { suites })
  }

  public async picture({ params, view }: HttpContextContract) {
    const suite = await Suite.findOrFail(params.suiteId)

    const [filename, extname] = suite['picture_' + params.picture].split('.')
    const picture = await Drive.getUrl(`${filename}-large.${extname}`)

    return view.render('htmx/picture', { picture })
  }
}

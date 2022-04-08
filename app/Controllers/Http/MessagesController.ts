import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Establishment from 'App/Models/Establishment'
import ContactValidator from 'App/Validators/ContactValidator'

export default class MessagesController {
  public async create({ request, view }: HttpContextContract) {
    const { establishment } = request.qs()
    return view.render('messages/create', { establishment })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const { establishment: establishmentId, ...data } = await request.validate(ContactValidator)

    const establishment = await Establishment.findOrFail(establishmentId)

    try {
      await establishment.related('messages').create({ ...data })
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de l'enregistrement du message")
      return response.redirect().withQs().back()
    }

    session.flash('success', 'Votre message a bien été envoyé')
    return response.redirect().toRoute('app.home')
  }
}

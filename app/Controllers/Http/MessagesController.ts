import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'
import ContactValidator from 'App/Validators/ContactValidator'

export default class MessagesController {
  public async create({ view }: HttpContextContract) {
    return view.render('messages/create')
  }

  public async store({ request, response, session }: HttpContextContract) {
    const data = await request.validate(ContactValidator)

    try {
      await Message.create({ ...data })
    } catch (error) {
      session.flash('error', "Un problème est survenu lors de l'enregistrement du message")
      return response.redirect().back()
    }

    session.flash('success', 'Votre message a bien été envoyé')
    return response.redirect().toRoute('app.home')
  }
}

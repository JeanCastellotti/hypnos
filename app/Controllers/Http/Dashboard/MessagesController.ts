import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'
import ContactValidator from 'App/Validators/ContactValidator'

export default class MessagesController {
  public async index({ view, bouncer }: HttpContextContract) {
    await bouncer.with('DashboardPolicy').authorize('viewMessages')

    const messages = await Message.query().preload('establishment').orderBy('created_at', 'desc')

    return view.render('dashboard/messages/index', { messages })
  }

  public async show({ params, view }: HttpContextContract) {
    const message = await Message.findOrFail(params.id)
    return view.render('dashboard/messages/show', { message })
  }

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

  public async delete({ params, view }: HttpContextContract) {
    const message = await Message.findOrFail(params.id)
    return view.render('dashboard/messages/delete', { message })
  }

  public async destroy({ params, response, session }) {
    const message = await Message.findOrFail(params.id)

    try {
      await message.delete()
    } catch (error) {
      session.flash(
        'error',
        'Un problème est survenu lors de la suppression du message. Veuillez réessayer ultérieurement'
      )
      return response.redirect().back()
    }

    session.flash('success', 'Le message a bien été supprimé')
    return response.redirect().toRoute('dashboard.messages.index')
  }
}

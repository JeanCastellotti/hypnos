import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SuiteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    price: schema.number(),
    booking_url: schema.string({ trim: true }, [rules.url()]),
    picture1: schema.file({ extnames: ['jpg', 'jpeg', 'png'] }),
    picture2: schema.file({ extnames: ['jpg', 'jpeg', 'png'] }),
  })

  public messages = {
    'title.required': 'Le titre est obligatoire',
    'description.required': 'La description est obligatoire',
    'price.required': 'Le prix est obligatoire',
    'booking_url.required': 'Le lien booking est obligatoire',
    'booking_url.url': "Le lien booking n'est pas valide",
    'establishment_id.required': "L'établissement est obligatoire",
    'picture1.required': 'La première image est obligatoire',
    'picture2.required': 'La deuxième image est obligatoire',
  }
}

import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EstablishmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    city: schema.string({ trim: true }),
    address: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    user_id: schema.number.optional(),
    hero: schema.file({ extnames: ['jpg', 'jpeg', 'png'] }),
  })

  public messages = {
    'name.required': 'Le nom est obligatoire',
    'city.required': 'La ville est obligatoire',
    'address.required': "L'adresse est obligatoire",
    'description.required': 'La description est obligatoire',
    'hero.required': "L'image est obligatoire",
  }
}

import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }),
    password: schema.string({ trim: true }),
  })

  public messages = {
    'email.required': "L'adresse email est obligatoire",
    'password.required': 'Le mot de passe est obligatoire',
  }
}

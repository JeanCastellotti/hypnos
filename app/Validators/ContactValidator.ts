import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    subject: schema.enum(['info', 'service', 'issue', 'complaint'] as const),
    lastname: schema.string({ trim: true }, [rules.alpha()]),
    firstname: schema.string({ trim: true }, [rules.alpha()]),
    email: schema.string({ trim: true }, [rules.email()]),
    message: schema.string({ trim: true }),
  })

  public messages = {
    'subject.required': 'Le sujet est obligatoire',
    'lastname.required': 'Le nom est obligatoire',
    'firstname.required': 'Le prénom est obligatoire',
    'email.required': "L'adresse email est obligatoire",
    'email.email': "L'adresse email est invalide",
    'message.required': 'Le message est obligatoire',
  }
}

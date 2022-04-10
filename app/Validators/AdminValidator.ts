import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    lastname: schema.string({ trim: true }, [rules.alpha()]),
    firstname: schema.string({ trim: true }, [rules.alpha()]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [rules.confirmed(), rules.minLength(8)]),
  })

  public messages = {
    'lastname.required': 'Le nom est obligatoire',
    'firstname.required': 'Le prénom est obligatoire',
    'email.required': "L'adresse email est obligatoire",
    'email.email': "L'adresse email n'est pas valide",
    'email.unique': "L'adresse email n'est pas disponible",
    'password.required': 'Le mot de passe est obligatoire',
    'password.minLength': 'Le mot de passe doit faire au moins 8 caractères',
    'confirmed': 'Les mots de passe ne correspondent pas',
  }
}

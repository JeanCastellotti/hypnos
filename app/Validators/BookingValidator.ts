import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BookingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    establishment: schema.number(),
    suite: schema.number(),
    from: schema.date({}, [rules.afterOrEqual('today')]),
    to: schema.date({}, [rules.afterOrEqualToField('from')]),
  })

  public messages = {
    'establishment.required': "L'établissement est obligatoire",
    'suite.required': 'La suite est obligatoire',
    'from.required': 'Le début du séjour est obligatoire',
    'from.afterOrEqual': 'Le début du séjour est invalide',
    'to.required': 'La fin du séjour est obligatoire',
    'to.afterOrEqualToField': 'La fin du séjour est invalide',
  }
}

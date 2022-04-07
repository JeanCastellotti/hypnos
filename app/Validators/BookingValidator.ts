import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BookingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    establishment: schema.number(),
    suite: schema.number(),
    start: schema.date({}, [rules.afterOrEqual('today')]),
    end: schema.date({}, [rules.afterField('start')]),
  })

  public messages = {
    'establishment.required': "L'établissement est obligatoire",
    'suite.required': 'La suite est obligatoire',
    'start.required': 'Le début du séjour est obligatoire',
    'start.afterOrEqual': 'Le début du séjour est invalide',
    'end.required': 'La fin du séjour est obligatoire',
    'end.afterField': 'La fin du séjour est invalide',
  }
}

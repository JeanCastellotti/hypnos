/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('greaterThan', (value, [num], options) => {
  if (typeof value !== 'number') {
    return
  }

  if (value <= num) {
    options.errorReporter.report(
      options.pointer,
      'greaterThan',
      'greaterThan validation failed',
      options.arrayExpressionPointer,
      { num }
    )
  }
})

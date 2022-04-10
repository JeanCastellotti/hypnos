import Route from '@ioc:Adonis/Core/Route'
import Role from 'App/Enums/Roles'

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'SettingsController.index').as('index')
    Route.post('/', 'SettingsController.update').as('update')
  })
    .prefix('settings')
    .as('settings')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'ManagersController.index').as('index')
      Route.get('create', 'ManagersController.create').as('create')
      Route.post('create', 'ManagersController.store').as('store')
      Route.get('update/:id', 'ManagersController.edit').as('edit')
      Route.post('update/:id', 'ManagersController.update').as('update')
      Route.get('delete/:id', 'ManagersController.delete').as('delete')
      Route.delete('delete/:id', 'ManagersController.destroy').as('destroy')
    })
      .prefix('managers')
      .as('managers')

    Route.group(() => {
      Route.get('/', 'EstablishmentsController.index').as('index')
      Route.get('create', 'EstablishmentsController.create').as('create')
      Route.post('create', 'EstablishmentsController.store').as('store')
      Route.get('update/:id', 'EstablishmentsController.edit').as('edit')
      Route.post('update/:id', 'EstablishmentsController.update').as('update')
      Route.get('delete/:id', 'EstablishmentsController.delete').as('delete')
      Route.delete('delete/:id', 'EstablishmentsController.destroy').as('destroy')
    })
      .prefix('establishments')
      .as('establishments')

    Route.group(() => {
      Route.get('/', 'MessagesController.index').as('index')
      Route.get('show/:id', 'MessagesController.show').as('show')
      Route.get('delete/:id', 'MessagesController.delete').as('delete')
      Route.delete('delete/:id', 'MessagesController.destroy').as('destroy')
    })
      .as('messages')
      .prefix('messages')
  }) //.middleware('admin')

  Route.group(() => {
    Route.get('/', 'SuitesController.index').as('index')
    Route.get('create', 'SuitesController.create').as('create')
    Route.post('create', 'SuitesController.store').as('store')
    Route.get('update/:id', 'SuitesController.edit').as('edit')
    Route.post('update/:id', 'SuitesController.update').as('update')
    Route.get('delete/:id', 'SuitesController.delete').as('delete')
    Route.delete('delete/:id', 'SuitesController.destroy').as('destroy')
  })
    .prefix('/suites')
    .as('suites')
  //.middleware('manager')

  Route.group(() => {
    Route.get('/', 'BookingsController.index').as('index')
    Route.get('delete/:id', 'BookingsController.delete').as('delete')
    Route.delete('delete/:id', 'BookingsController.destroy').as('destroy')
  })
    .prefix('bookings')
    .as('bookings')
})
  .namespace('App/Controllers/Http/Dashboard')
  .prefix('dashboard')
  .as('dashboard')
  .middleware('auth')
  .middleware(({ view }, next) => {
    view.share({
      Role,
    })
    return next()
  })

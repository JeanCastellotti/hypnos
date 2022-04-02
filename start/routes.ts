/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/suites', 'AppController.suites')

Route.group(() => {
  Route.get('/', 'AppController.main').as('home')

  Route.group(() => {
    Route.get('/admin', 'AppController.createAdmin').as('create')
    Route.post('/admin', 'AppController.storeAdmin').as('store')
  }).as('admin')
}).as('app')

Route.group(() => {
  Route.get('contact', 'MessagesController.create').as('create')
  Route.post('contact', 'MessagesController.store').as('store')
}).as('messages')

Route.group(() => {
  Route.get('create', 'BookingsController.create').as('create')
  Route.post('create', 'BookingsController.store').as('store')
})
  .prefix('bookings')
  .as('bookings')

Route.get('/establishments/:name', 'EstablishmentsController.show').as('establishments.show')

Route.group(() => {
  Route.group(() => {
    Route.get('/login', 'AuthController.showLogin').as('showLogin')
    Route.get('/signup', 'AuthController.showSignup').as('showSignup')
  }).middleware('guest')

  Route.post('/login', 'AuthController.login').as('login')
  Route.post('/signup', 'AuthController.signup').as('signup')

  Route.get('/logout', 'AuthController.logout').as('logout').middleware('auth')
}).as('auth')

Route.group(() => {
  Route.on('/').render('pages/dashboard/index').as('index')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'Dashboard/ManagersController.index').as('index')
      Route.get('/create', 'Dashboard/ManagersController.create').as('create')
      Route.post('/create', 'Dashboard/ManagersController.store').as('store')
      Route.get('/update/:id', 'Dashboard/ManagersController.edit').as('edit')
      Route.post('/update/:id', 'Dashboard/ManagersController.update').as('update')
      Route.get('/delete/:id', 'Dashboard/ManagersController.delete').as('delete')
      Route.delete('/delete/:id', 'Dashboard/ManagersController.destroy').as('destroy')
    })
      .prefix('managers')
      .as('managers')

    Route.group(() => {
      Route.get('/', 'Dashboard/EstablishmentsController.index').as('index')
      Route.get('/create', 'Dashboard/EstablishmentsController.create').as('create')
      Route.post('/create', 'Dashboard/EstablishmentsController.store').as('store')
      Route.get('/update/:id', 'Dashboard/EstablishmentsController.edit').as('edit')
      Route.post('/update/:id', 'Dashboard/EstablishmentsController.update').as('update')
      Route.get('/delete/:id', 'Dashboard/EstablishmentsController.delete').as('delete')
      Route.delete('/delete/:id', 'Dashboard/EstablishmentsController.destroy').as('destroy')
    })
      .prefix('/establishments')
      .as('establishments')

    Route.group(() => {
      Route.get('/', 'Dashboard/MessagesController.index').as('index')
      Route.get('/show/:id', 'Dashboard/MessagesController.show').as('show')
      Route.get('/delete/:id', 'Dashboard/MessagesController.delete').as('delete')
      Route.delete('/delete/:id', 'Dashboard/MessagesController.destroy').as('destroy')
    })
      .as('messages')
      .prefix('messages')
  }).middleware('admin')

  Route.group(() => {
    Route.get('/', 'Dashboard/SuitesController.index').as('index')
    Route.get('/create', 'Dashboard/SuitesController.create').as('create')
    Route.post('/create', 'Dashboard/SuitesController.store').as('store')
    Route.get('/update/:id', 'Dashboard/SuitesController.edit').as('edit')
    Route.post('/update/:id', 'Dashboard/SuitesController.update').as('update')
    Route.get('/delete/:id', 'Dashboard/SuitesController.delete').as('delete')
    Route.delete('/delete/:id', 'Dashboard/SuitesController.destroy').as('destroy')
  })
    .prefix('/suites')
    .as('suites')
    .middleware('manager')

  Route.group(() => {
    Route.get('/', 'Dashboard/BookingsController.index').as('index')
    Route.get('/delete/:id', 'Dashboard/BookingsController.delete').as('delete')
    Route.delete('/delete/:id', 'Dashboard/BookingsController.destroy').as('destroy')
  })
    .prefix('bookings')
    .as('bookings')
})
  .prefix('/dashboard')
  .as('dashboard')
  .middleware('auth')

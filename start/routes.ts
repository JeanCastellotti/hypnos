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
  Route.get('/login', 'AuthController.showLogin').as('showLogin')
  Route.post('/login', 'AuthController.login').as('login')
  Route.get('/signup', 'AuthController.showSignup').as('showSignup')
  Route.post('/signup', 'AuthController.signup').as('signup')
  Route.get('/logout', 'AuthController.logout').as('logout')
}).as('auth')

Route.group(() => {
  Route.on('/').render('pages/dashboard/index').as('index')

  Route.group(() => {
    Route.get('/', 'DashboardController.managers').as('index')
    Route.get('/create', 'DashboardController.createManager').as('create')
    Route.post('/create', 'DashboardController.storeManager').as('store')
    Route.get('/update/:id', 'DashboardController.editManager').as('edit')
    Route.post('/update/:id', 'DashboardController.updateManager').as('update')
    Route.delete('/delete', 'DashboardController.destroyManager').as('destroy')
  })
    .prefix('/managers')
    .as('managers')

  Route.group(() => {
    Route.get('/', 'DashboardController.establishments').as('index')
    Route.get('/create', 'DashboardController.createEstablishment').as('create')
    Route.post('/create', 'DashboardController.storeEstablishment').as('store')
    Route.get('/update/:id', 'DashboardController.editEstablishment').as('edit')
    Route.post('/update/:id', 'DashboardController.updateEstablishment').as('update')
    Route.delete('/delete', 'DashboardController.destroyEstablishment').as('destroy')
  })
    .prefix('/establishments')
    .as('establishments')

  Route.group(() => {
    Route.get('/', 'DashboardController.suites').as('index')
    Route.get('/create', 'DashboardController.createSuite').as('create')
    Route.post('/create', 'DashboardController.storeSuite').as('store')
    Route.get('/update/:id', 'DashboardController.editSuite').as('edit')
    Route.post('/update/:id', 'DashboardController.updateSuite').as('update')
    Route.delete('/delete', 'DashboardController.destroySuite').as('destroy')
  })
    .prefix('/suites')
    .as('suites')

  Route.group(() => {
    Route.get('/', 'MessagesController.index').as('index')
    Route.get('/show/:id', 'MessagesController.show').as('show')
    Route.get('/delete/:id', 'MessagesController.delete').as('delete')
  })
    .as('messages')
    .prefix('messages')

  Route.group(() => {
    Route.get('/', 'BookingsController.index').as('index')
    Route.delete('/delete', 'BookingsController.destroy').as('destroy')
  })
    .prefix('bookings')
    .as('bookings')
})
  .prefix('/dashboard')
  .as('dashboard')
  .middleware('auth')

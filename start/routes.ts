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

import './routes/auth'
import './routes/dashboard'

Route.group(() => {
  Route.post('suites', 'AppController.suites')
  Route.get('pictures/:filename', 'AppController.picture')
}).prefix('htmx')

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

Route.get('/establishments/:slug', 'EstablishmentsController.show').as('establishments.show')

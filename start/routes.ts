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

Route.on('/').render('index').as('home')

Route.get('/admin', 'AppController.showAdmin')
Route.post('/admin', 'AppController.storeAdmin')

Route.on('/login').render('auth/login').as('auth.login')
Route.post('/login', 'AuthController.login')

Route.get('/logout', 'AuthController.logout').as('auth.logout')

Route.group(() => {
  Route.on('/').render('dashboard/index').as('index')

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
})
  .prefix('/dashboard')
  .as('dashboard')
  .middleware('auth')

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
  Route.on('/').render('dashboard/index').as('dashboard.index')

  Route.group(() => {
    Route.get('/', 'DashboardController.managers').as('dashboard.managers')
    Route.on('/create').render('dashboard/managers/create').as('dashboard.managers.create')
    Route.post('/create', 'DashboardController.storeManager')
    Route.get('/update/:id', 'DashboardController.editManager').as('dashboard.managers.edit')
    Route.post('/update/:id', 'DashboardController.updateManager')
    Route.delete('/delete/:id', 'DashboardController.destroyManager').as(
      'dashboard.managers.destroy'
    )
  }).prefix('/managers')

  Route.group(() => {
    Route.get('/', 'DashboardController.establishments').as('dashboard.establishments')
    Route.get('/create', 'DashboardController.createEstablishment').as(
      'dashboard.establishments.create'
    )
    Route.post('/create', 'DashboardController.storeEstablishment')
    Route.get('/update/:id', 'DashboardController.editEstablishment').as(
      'dashboard.establishments.edit'
    )
    Route.post('/update/:id', 'DashboardController.updateEstablishment')
    Route.delete('/delete/:id', 'DashboardController.destroyEstablishment').as(
      'dashboard.establishments.destroy'
    )
  }).prefix('/establishments')
})
  .prefix('/dashboard')
  .middleware('auth')

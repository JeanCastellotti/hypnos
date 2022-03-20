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
  Route.get('/establishments', 'DashboardController.establishments').as('dashboard.establishments')
  Route.group(() => {
    Route.get('/', 'DashboardController.managers').as('dashboard.managers')
    Route.on('/create').render('dashboard/create-manager').as('dashboard.createManager')
    Route.post('/create', 'DashboardController.storeManager')
    Route.get('/update/:id', 'DashboardController.showManager').as('dashboard.showManager')
    Route.post('/update/:id', 'DashboardController.updateManager')
  }).prefix('/managers')
})
  .prefix('/dashboard')
  .middleware('auth')

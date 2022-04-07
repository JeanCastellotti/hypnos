import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/login', 'AuthController.showLogin').as('showLogin')
    Route.get('/signup', 'AuthController.showSignup').as('showSignup')
    Route.post('/login', 'AuthController.login').as('login')
    Route.post('/signup', 'AuthController.signup').as('signup')
  }).middleware('guest')

  Route.get('/logout', 'AuthController.logout').as('logout').middleware('auth')
}).as('auth')

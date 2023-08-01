import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'UsersController.index')
  //     Route.post('/login', 'UsersController.login')
  //     Route.post('/register', 'AuthenticationController.register')
  //     Route.delete('/logout', 'AuthenticationController.logout')
})
  .prefix('/users')
  .namespace('App/Domains/User/Controllers')

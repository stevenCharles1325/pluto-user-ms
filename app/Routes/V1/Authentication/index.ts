import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/me', 'AuthenticationController.verify')
  Route.post('/login', 'AuthenticationController.login')
  Route.post('/register', 'AuthenticationController.register')
  Route.delete('/logout', 'AuthenticationController.logout')
  Route.put('/refresh-token', 'AuthenticationController.refresh')
})
  .prefix('/auth')
  .namespace('App/Domains/Authentication/Controllers')

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'UsersController.index')
  Route.post('/', 'UsersController.store')
  Route.put('/:id', 'UsersController.update')
  Route.delete('/:id/archive', 'UsersController.softDelete')
  Route.delete('/:id', 'UsersController.destroy')
})
  .prefix('/users')
  .namespace('App/Domains/User/Controllers')

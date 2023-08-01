import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthUser from '@ioc:AuthUser'
import User from '../Models/User'

export default class UsersController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { page = 1, limit = 10 } = request.qs()
    const hasPermission = await AuthUser.hasPermission('view-all-users')

    if (hasPermission) {
      const query = await User.query()
        .apply((scope) => scope.search(request))
        .paginate(page, limit)

      return response.ok(query)
    }

    return response.unauthorized('You have no permissions to view users')
  }

  // public async create({ }: HttpContextContract) { }

  // public async store({ }: HttpContextContract) { }

  // public async show({ }: HttpContextContract) { }

  // public async edit({ }: HttpContextContract) { }

  // public async update({ }: HttpContextContract) { }

  // public async destroy({ }: HttpContextContract) { }
}

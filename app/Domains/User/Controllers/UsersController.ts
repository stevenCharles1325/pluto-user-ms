import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../Models/User'

export default class UsersController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { page = 1, limit = 10 } = request.qs()

    // If you need to access the logged in user
    // const user = auth.use('jwt').user

    const query = await User.query()
      .apply((scope) => scope.search(request))
      .paginate(page, limit)

    return response.ok(query)
  }

  // public async create({ }: HttpContextContract) { }

  // public async store({ }: HttpContextContract) { }

  // public async show({ }: HttpContextContract) { }

  // public async edit({ }: HttpContextContract) { }

  // public async update({ }: HttpContextContract) { }

  // public async destroy({ }: HttpContextContract) { }
}

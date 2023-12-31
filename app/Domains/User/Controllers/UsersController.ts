import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditTrail from '@ioc:AuditTrail'
import AuthUser from '@ioc:AuthUser'
import PhoneNumberCreateValidator from 'App/Domains/PhoneNumber/Validators/PhoneNumberCreateValidator'
import PhoneNumberUpdateValidator from 'App/Domains/PhoneNumber/Validators/PhoneNumberUpdateValidator'
import User from '../Models/User'
import UserCreateValidator from '../Validators/UserCreateValidator'
import UserUpdateValidator from '../Validators/UserUpdateValidator'

export default class UsersController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { page = 1, limit = 10 } = request.qs()
    const hasPermission = await AuthUser.hasPermission('view-all-users')

    if (hasPermission) {
      const query = await User.query()
        .whereNot('id', AuthUser.user.id)
        .apply((scope) => scope.search(request))
        .paginate(page, limit)

      return response.ok(query)
    }

    return response.unauthorized('You have no permissions to view users')
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const hasPermission = await AuthUser.hasPermission('create-user')

    if (hasPermission) {
      const payload = await request.validate(UserCreateValidator)
      const phoneNumber = await request.validate(PhoneNumberCreateValidator)

      try {
        const user = await User.create(payload)
        await user.related('phoneNumbers').create({ userId: user.id, ...phoneNumber })

        await AuditTrail.log({ actionType: 'user-create', relatedId: user.id })
        return response.created({
          message: 'User created successfully',
          user,
        })
      } catch (error) {
        console.log(error)
        return response.internalServerError('Please try again after 5 mins')
      }
    }

    return response.unauthorized('You have no permissions to create users')
  }

  public async show({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { id } = params
    const hasPermission = await AuthUser.hasPermission('view-user')

    if (hasPermission) {
      const user = await User.find(id)
      return response.ok(user)
    }

    return response.unauthorized('You have no permissions to view users')
  }

  public async update({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { id } = params

    const hasPermission = await AuthUser.hasPermission('update-user')
    const phoneNumber = await request.validate(PhoneNumberUpdateValidator)

    if (hasPermission) {
      const payload = await request.validate(UserUpdateValidator)
      const user = await User.query().where({ id }).firstOrFail()

      if (phoneNumber) {
        user.related('phoneNumbers').updateOrCreate(phoneNumber, phoneNumber)
      }

      await AuditTrail.log({ actionType: 'user-update', relatedId: user.id })
      user.merge(payload)
      await user.save()
      return response.ok(user)
    }

    return response.unauthorized('You have no permissions to update users')
  }

  public async softDelete({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { id } = params
    const hasPermission = await AuthUser.hasPermission('archive-user')

    if (hasPermission) {
      const user = await User.findOrFail(id)

      await AuditTrail.log({ actionType: 'user-archive', relatedId: user.id })
      await user.softDelete()
      return response.ok(user)
    }

    return response.unauthorized('You have no permissions to temporarily delete users')
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()
    const { id } = params
    const hasPermission = await AuthUser.hasPermission('delete-user')

    if (hasPermission) {
      const user = await User.findOrFail(id)

      await AuditTrail.log({ actionType: 'user-delete', relatedId: user.id })
      await user.delete()
      return response.ok(user)
    }

    return response.unauthorized('You have no permissions to permanently delete users')
  }
}

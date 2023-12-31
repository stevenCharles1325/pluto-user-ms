import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from '../Validators/LoginValidator'
import User from 'App/Domains/User/Models/User'
import RegisterValidator from '../Validators/RegisterValidator'
import PhoneNumberCreateValidator from 'App/Domains/PhoneNumber/Validators/PhoneNumberCreateValidator'
import AuditTrail from '@ioc:AuditTrail'

export default class AuthenticationController {
  public async verify({ auth, response }: HttpContextContract) {
    await auth.use('jwt').check()

    if (auth.use('jwt').isLoggedIn) {
      return response.ok('Authorized')
    } else {
      return response.unauthorized('Unauthorized')
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(LoginValidator)
    const user = await User.findBy('username', payload.username)

    if (user) {
      try {
        const token = await auth.use('jwt').attempt(user.email, payload.password)

        await AuditTrail.log({ actionType: 'user-login' })
        return response.ok({
          message: 'Successfully logged-in',
          token,
        })
      } catch {
        return response.unauthorized('Invalid credentials')
      }
    } else {
      return response.notFound('Username not found')
    }
  }

  public async register({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)
    const phoneNumber = await request.validate(PhoneNumberCreateValidator)

    try {
      delete payload.passwordConfirmation

      const user = await User.create(payload)
      await user.related('phoneNumbers').create({ userId: user.id, ...phoneNumber })

      if (user) {
        const token = await auth.use('jwt').generate(user)

        await AuditTrail.log({ actionType: 'user-register' })
        return response.created({
          message: 'Successfully registered',
          token,
        })
      } else {
        return response.internalServerError('Please try again after 5 mins')
      }
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again after 5 mins')
    }
  }

  public async refresh({ auth, request, response }: HttpContextContract) {
    const refreshToken = request.input('refreshToken')
    const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken)

    return response.ok(jwt)
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('jwt').revoke()

    await AuditTrail.log({ actionType: 'user-logout' })
    return response.ok('Successfully logged-out')
  }
}

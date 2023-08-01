import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class AuthUserService {
  constructor() {}

  public async hasPermission(...permissions: string[]): Promise<Boolean> {
    const ctx = HttpContext.get()

    if (ctx) {
      await ctx.auth.use('jwt').authenticate()
      const user = ctx.auth.use('jwt').user

      await user?.load((loader) => loader.load('roles', (roles) => roles.preload('permissions')))

      const userPermissions =
        user?.roles?.flatMap((role) => role?.permissions.map(({ kebab }) => kebab)) ?? []

      if (userPermissions.length) {
        return permissions?.every((permission) => userPermissions.includes(permission))
      }

      console.warn('Auth user does not have any permissions')
      return false
    } else {
      throw new Error('Cannot access http context')
    }
  }
}

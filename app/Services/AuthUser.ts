import HttpContext from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Domains/User/Models/User'

export default class AuthUserService {
  private role = {
    SYSTEM_ADMIN: 'SYSTEM ADMINISTRATOR',
    ADMIN: 'ADMINISTRATOR',
  }

  public user: User

  public async getUser(): Promise<void> {
    const ctx = HttpContext.get()

    if (ctx) {
      await ctx.auth.use('jwt').authenticate()
      const user = ctx.auth.use('jwt').user!
      this.user = user

      return
    }

    throw new Error('Cannot access http context')
  }

  public async hasPermission(...permissions: string[]): Promise<Boolean> {
    const ctx = HttpContext.get()

    if (ctx) {
      await ctx.auth.use('jwt').authenticate()
      const user = ctx.auth.use('jwt').user!
      this.user = user

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

  public async isSystemAdministrator(): Promise<Boolean> {
    const ctx = HttpContext.get()

    if (ctx) {
      await ctx.auth.use('jwt').authenticate()
      const user = ctx.auth.use('jwt').user!
      this.user = user

      await user?.load('roles')
      const userRoles = user?.roles?.map(({ title }) => title) ?? []

      if (userRoles.length) {
        return userRoles.some((role) => role === this.role.SYSTEM_ADMIN)
      }

      console.warn('Auth user does not have any roles yet')
      return false
    } else {
      throw new Error('Cannot access http context')
    }
  }

  public async isAdministrator(): Promise<Boolean> {
    const ctx = HttpContext.get()

    if (ctx) {
      await ctx.auth.use('jwt').authenticate()
      const user = ctx.auth.use('jwt').user!
      this.user = user

      await user?.load('roles')
      const userRoles = user?.roles?.map(({ title }) => title) ?? []

      if (userRoles.length) {
        return userRoles.some((role) => role === this.role.ADMIN)
      }

      console.warn('Auth user does not have any roles yet')
      return false
    } else {
      throw new Error('Cannot access http context')
    }
  }

  public async isLowLevelUser(): Promise<Boolean> {
    const ctx = HttpContext.get()

    if (ctx) {
      await ctx.auth.use('jwt').authenticate()
      const user = ctx.auth.use('jwt').user!
      this.user = user

      await user?.load('roles')
      const userRoles = user?.roles?.map(({ title }) => title) ?? []

      if (userRoles.length) {
        const highRoles = Object.values(this.role)

        return userRoles.some((role) => !highRoles.includes(role))
      }

      console.warn('Auth user does not have any roles yet')
      return false
    } else {
      throw new Error('Cannot access http context')
    }
  }
}

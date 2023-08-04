import LogContract from 'App/Interfaces/LogContract'
import LogDetails from 'App/Interfaces/LogDetails'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Domains/User/Models/User'
import { string } from '@ioc:Adonis/Core/Helpers'

/* 
  [NOTE] 
  Always use this class inside HTTP controllers, or anywhere you
  can get the HTTP context.

  See https://docs.adonisjs.com/guides/context#access-http-context-from-anywhere for more info.
*/

export default class BaseLog implements LogContract {
  protected creator: User | null
  protected relatedUser: User | null
  protected hasUsersFetched = false

  constructor(
    public logDetails: LogDetails,
    public ctx: HttpContextContract = HttpContext.get()!
  ) {}

  protected async getLogUsers() {
    const user = this.ctx.auth.use('jwt').user

    if (this.ctx && user) {
      this.creator = await User.find(user.id)

      if (this.logDetails.relatedId) {
        this.relatedUser = await User.find(this.logDetails.relatedId)
      }

      this.hasUsersFetched = true
    } else {
      throw new Error('[AUDIT TRAIL]: Cannot access HTTP Context')
    }
  }

  public get creatorName(): string {
    if (this.hasUsersFetched) {
      return string.titleCase(this.creator!.fullName)
    } else {
      throw new Error(`[AUDIT TRAIL]: Method 'getLogUsers' has not been invoked yet`)
    }
  }

  public get relatedUserName(): string {
    if (this.hasUsersFetched) {
      return string.titleCase(this.relatedUser!.fullName)
    } else {
      throw new Error(`[AUDIT TRAIL]: Method 'getLogUsers' has not been invoked yet`)
    }
  }

  public async description(): Promise<string> {
    try {
      await this.getLogUsers()
      const { relatedId } = this.logDetails

      if (this.relatedUser && relatedId !== this.creator!.id) {
        return `An unknown action type happened, created by user ${this.creatorName} for user ${this.relatedUserName}`
      } else {
        return `An unknown action type happened, created by user ${this.creatorName}`
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

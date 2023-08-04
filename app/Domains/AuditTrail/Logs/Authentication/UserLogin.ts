import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContext } from '@adonisjs/core/build/standalone'
import LogDetails from 'App/Interfaces/LogDetails'
import BaseLog from '../BaseLog'

export default class UserLoginLog extends BaseLog {
  constructor(
    public logDetails: LogDetails,
    public ctx: HttpContextContract = HttpContext.get()!
  ) {
    super(logDetails, ctx)
  }

  public async description(): Promise<string> {
    try {
      await this.getLogUsers()
      const { relatedId } = this.logDetails

      if (this.relatedUser && relatedId !== this.creator!.id) {
        return `${this.creatorName} has logged-in a user named ${this.relatedUserName}`
      } else {
        return `User ${this.creatorName} has logged-in`
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
